/**
 * FrameStore — two-level cache for a long image sequence.
 *
 *  Level 1  compressed bytes (Blob) for EVERY frame. Cheap (~13 MB for 240
 *           frames), fetched in the background, nearest-to-playhead first.
 *  Level 2  decoded ImageBitmaps for a moving WINDOW around the playhead plus
 *           a sparse set of "anchor" frames. Decoded frames are big
 *           (1600×900 ≈ 5.8 MB each), so keeping all 240 would need >1 GB;
 *           the window keeps memory bounded by a byte budget.
 *
 * Rendering never waits: `nearest()` always returns *some* decoded frame, so a
 * fast flick shows a close frame instead of a blank or a stall.
 */

const IDLE = 0;
const LOADING = 1;
const LOADED = 2;
const FAILED = 3;

async function decodeBlob(blob) {
  if (typeof createImageBitmap === 'function') return createImageBitmap(blob);
  // Very old browsers: fall back to an <img> (has no close(), that's fine).
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const release = (bmp) => bmp && typeof bmp.close === 'function' && bmp.close();

export class FrameStore {
  constructor({
    count,
    urlFor,
    bytesPerFrame,
    maxDecodedBytes = 256 * 1024 * 1024,
    anchorEvery = 16, // permanently decoded fallback frames
    coarseEvery = 12, // fetched first so any position has a nearby frame
    windowAhead = 22, // decoded frames kept in the direction of travel
    windowBehind = 10, // …and behind it, so reversing is instant
    fetchConcurrency = 6,
    decodeConcurrency = 3,
    onFrameDecoded,
    onLoadProgress,
    onCoarseReady,
  }) {
    this.count = count;
    this.urlFor = urlFor;
    this.fetchConcurrency = fetchConcurrency;
    this.decodeConcurrency = decodeConcurrency;
    this.coarseEvery = coarseEvery;
    this.onFrameDecoded = onFrameDecoded;
    this.onLoadProgress = onLoadProgress;
    this.onCoarseReady = onCoarseReady;

    this.anchors = [];
    for (let i = 0; i < count; i += anchorEvery) this.anchors.push(i);
    if (this.anchors[this.anchors.length - 1] !== count - 1) this.anchors.push(count - 1);

    // Budget → how many frames we may keep decoded at once.
    this.maxDecoded = Math.min(count, Math.max(12, Math.floor(maxDecodedBytes / bytesPerFrame)));
    const room = Math.max(4, this.maxDecoded - this.anchors.length);
    this.ahead = Math.min(windowAhead, Math.floor(room * 0.65));
    this.behind = Math.min(windowBehind, Math.floor(room * 0.3));

    this.blobs = new Array(count).fill(null);
    this.bitmaps = new Array(count).fill(null);
    this.fetchState = new Uint8Array(count);
    this.attempts = new Uint8Array(count);
    this.retryAt = new Float64Array(count);
    this.decoding = new Uint8Array(count);
    this.decodeFailed = new Uint8Array(count);
    this.wanted = new Uint8Array(count);

    this.activeFetch = 0;
    this.activeDecode = 0;
    this.loadedCount = 0;
    this.decodedCount = 0;
    this.coarseRemaining = 0;
    for (let i = 0; i < count; i++) if (this._isCoarse(i)) this.coarseRemaining++;

    this.focusIndex = 0;
    this.dir = 1;
    this.order = [];
    this.abort = new AbortController();
    this.destroyed = false;
    this._rebuildWanted();
  }

  /* ───────────── public API ───────────── */

  start(initialIndex = 0) {
    this.focus(initialIndex, 1, true);
  }

  /** Tell the store where the playhead is. Cheap; call on every index change. */
  focus(index, dir = this.dir, force = false) {
    if (this.destroyed) return;
    const i = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    const d = dir >= 0 ? 1 : -1;
    if (!force && i === this.focusIndex && d === this.dir) return;
    this.focusIndex = i;
    this.dir = d;
    this._rebuildWanted();
    this._pumpDecode();
    this._pumpFetch();
  }

  /** Decoded bitmap for exactly this frame, or null. */
  get(i) {
    return this.bitmaps[i] || null;
  }

  /** Closest decoded frame to `i` (never null once the first frame is in). */
  nearest(i) {
    for (let d = 0; d < this.count; d++) {
      const a = this.bitmaps[i - d];
      if (a) return a;
      const b = this.bitmaps[i + d];
      if (b) return b;
    }
    return null;
  }

  stats() {
    return {
      count: this.count,
      fetched: this.loadedCount,
      decoded: this.decodedCount,
      maxDecoded: this.maxDecoded,
      window: { ahead: this.ahead, behind: this.behind },
      activeFetch: this.activeFetch,
      activeDecode: this.activeDecode,
    };
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    for (let i = 0; i < this.count; i++) {
      release(this.bitmaps[i]);
      this.bitmaps[i] = null;
      this.blobs[i] = null;
    }
    this.decodedCount = 0;
  }

  /* ───────────── fetching ───────────── */

  _isCoarse(i) {
    return i % this.coarseEvery === 0 || i === this.count - 1;
  }

  /** Lower score = fetch sooner. */
  _nextToFetch() {
    const now = performance.now();
    let best = -1;
    let bestScore = Infinity;
    for (let i = 0; i < this.count; i++) {
      if (this.fetchState[i] !== IDLE || this.retryAt[i] > now) continue;
      const d = i - this.focusIndex;
      // Prefer the direction of travel; things behind cost a little more.
      const forward = d * this.dir;
      const dist = forward >= 0 ? forward : -forward * 1.5;
      let score = dist;
      if (Math.abs(d) <= 2) score -= 100000; // the frame on screen right now
      else if (this._isCoarse(i)) score -= 10000; // coarse pass before fill-in
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best;
  }

  _pumpFetch() {
    while (!this.destroyed && this.activeFetch < this.fetchConcurrency) {
      const i = this._nextToFetch();
      if (i < 0) break;
      this._fetch(i);
    }
  }

  async _fetch(i) {
    this.fetchState[i] = LOADING;
    this.activeFetch++;
    try {
      const res = await fetch(this.urlFor(i), { signal: this.abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (this.destroyed) return;
      this.blobs[i] = blob;
      this.fetchState[i] = LOADED;
      this.loadedCount++;
      this._settled(i);
    } catch (err) {
      if (this.destroyed) return;
      if (++this.attempts[i] < 3) {
        this.fetchState[i] = IDLE;
        this.retryAt[i] = performance.now() + 500 * this.attempts[i];
        setTimeout(() => this._pumpFetch(), 500 * this.attempts[i] + 10);
      } else {
        this.fetchState[i] = FAILED; // renderer falls back to nearest frame
        this._settled(i);
      }
    } finally {
      this.activeFetch--;
      if (!this.destroyed) {
        this._pumpDecode();
        this._pumpFetch();
      }
    }
  }

  _settled(i) {
    this.onLoadProgress?.(this.loadedCount / this.count);
    if (this._isCoarse(i) && --this.coarseRemaining === 0) this.onCoarseReady?.();
  }

  /* ───────────── decoding & eviction ───────────── */

  _rebuildWanted() {
    const f = this.focusIndex;
    const fwd = this.dir > 0 ? this.ahead : this.behind;
    const back = this.dir > 0 ? this.behind : this.ahead;
    const step = this.dir;

    const order = [f];
    for (let k = 1; k <= Math.max(fwd, back); k++) {
      if (k <= fwd && f + step * k >= 0 && f + step * k < this.count) order.push(f + step * k);
      if (k <= back && f - step * k >= 0 && f - step * k < this.count) order.push(f - step * k);
    }

    this.wanted.fill(0);
    for (const i of order) this.wanted[i] = 1;

    const anchorsByDistance = this.anchors
      .filter((a) => !this.wanted[a])
      .sort((a, b) => Math.abs(a - f) - Math.abs(b - f));
    for (const a of this.anchors) this.wanted[a] = 1;

    this.order = order.concat(anchorsByDistance);
  }

  _pumpDecode() {
    if (this.destroyed) return;
    for (const i of this.order) {
      if (this.activeDecode >= this.decodeConcurrency) break;
      if (this.bitmaps[i] || this.decoding[i] || !this.blobs[i] || this.decodeFailed[i]) continue;
      if (this.decodedCount + this.activeDecode >= this.maxDecoded && !this._evictOne()) break;
      this._decode(i);
    }
    this._trim();
  }

  async _decode(i) {
    this.decoding[i] = 1;
    this.activeDecode++;
    try {
      const bmp = await decodeBlob(this.blobs[i]);
      if (this.destroyed) return release(bmp);
      this.bitmaps[i] = bmp;
      this.decodedCount++;
      this.onFrameDecoded?.(i);
    } catch {
      this.decodeFailed[i] = 1;
    } finally {
      this.decoding[i] = 0;
      this.activeDecode--;
      this._pumpDecode();
    }
  }

  /** Free the decoded frame that is farthest from the playhead and not wanted. */
  _evictOne() {
    let victim = -1;
    let far = -1;
    for (let i = 0; i < this.count; i++) {
      if (!this.bitmaps[i] || this.wanted[i]) continue;
      const d = Math.abs(i - this.focusIndex);
      if (d > far) {
        far = d;
        victim = i;
      }
    }
    if (victim < 0) return false;
    release(this.bitmaps[victim]);
    this.bitmaps[victim] = null;
    this.decodedCount--;
    return true;
  }

  _trim() {
    while (this.decodedCount > this.maxDecoded && this._evictOne());
  }
}
