import { useEffect, useRef } from 'react';
import { FrameStore } from '../lib/frameStore';
import { clamp, damp, computeFit } from '../lib/math';
import { pickTier } from '../lib/tier';

const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Drives a canvas from scroll position.
 *
 *   scrollY ─► target progress (0‥1)          set in the scroll handler
 *                │
 *                ▼  exponential damping        rAF loop, frame-rate independent
 *           smoothed progress
 *                │
 *                ▼  hold zones + linear map
 *           fractional frame position f  (e.g. 113.4)
 *                │
 *                ▼  draw frame ⌊f⌋, then ⌈f⌉ at alpha = f − ⌊f⌋
 *              canvas
 *
 * Nothing here is time-based: if scroll stops, the loop stops, and the image
 * stays exactly where the scroll position says it should be. The same
 * position always renders the same pixels, in either direction.
 *
 * The hook also writes `--p` (section progress) and `--fp` (frame progress)
 * onto the section so CSS can drive overlays without any React re-renders.
 */
export function useScrollSequence(refs, options) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const section = refs.sectionRef.current;
    const stage = refs.stageRef.current;
    const canvas = refs.canvasRef.current;
    if (!section || !stage || !canvas) return undefined;

    const {
      manifest,
      holdStart = 0.05,
      holdEnd = 0.12,
      smoothing = 6,
      blend = true,
      portraitFit = 0.55,
      portraitAnchorY = 0.36,
      background = '#171c22',
    } = optionsRef.current;

    const tier = pickTier(manifest.tiers);
    const lastIndex = manifest.count - 1;
    const ctx = canvas.getContext('2d', { alpha: false });
    const bg = hexToRgb(background);
    const bgOpaque = `rgb(${bg.join(',')})`;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const base = import.meta.env.BASE_URL;

    section.dataset.status = 'loading';
    canvas.dataset.painted = 'false';

    /* ── state ── */
    let scrollable = 1; // px of scroll while pinned
    let fit = null; // where the frame sits on the canvas (canvas px)
    let feather = null; // gradients hiding letterbox seams
    let target = 0; // progress the scroll position asks for
    let current = 0; // smoothed progress actually shown
    let direction = 1;
    let lastF = -1;
    let dirty = true;
    let raf = 0;
    let lastT = 0;
    let visible = true;
    let snapUntil = performance.now() + 700; // absorb scroll restoration on load
    let lastVarsKey = '';

    /* ── frame store ── */
    const store = new FrameStore({
      count: manifest.count,
      urlFor: (i) =>
        `${base}${tier.dir}/${String(i + 1).padStart(manifest.digits, '0')}.${manifest.extension}`,
      bytesPerFrame: tier.width * tier.height * 4,
      maxDecodedBytes: tier.budgetMB * 1024 * 1024,
      onFrameDecoded: (i) => {
        // A frame we're showing (or blending with) just arrived → repaint.
        if (Math.abs(i - lastF) <= 1.5 || lastF < 0) {
          dirty = true;
          kick();
        }
      },
      onLoadProgress: (v) => section.style.setProperty('--load', v.toFixed(3)),
      onCoarseReady: () => {
        section.dataset.status = 'ready';
      },
    });

    if (import.meta.env.DEV) window.__seq = { store, tier, state: () => ({ target, current, lastF }) };

    /* ── helpers ── */
    const readProgress = () => clamp(-section.getBoundingClientRect().top / scrollable);
    const toFrameProgress = (p) => clamp((p - holdStart) / (1 - holdStart - holdEnd));

    function draw(f) {
      if (!fit) return;
      const i0 = Math.min(lastIndex, Math.floor(f));
      const i1 = Math.min(lastIndex, i0 + 1);
      const t = f - i0;

      const exact = store.get(i0);
      const a = exact || store.nearest(i0);
      if (!a) return; // nothing decoded yet; canvas stays hidden (CSS)

      const { dx, dy, dw, dh } = fit;
      const letterboxed = dy > 0.5;
      if (letterboxed) {
        ctx.fillStyle = bgOpaque;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(a, dx, dy, dw, dh);

      // Sub-frame interpolation: blend toward the next frame by the
      // fractional part. Only when both frames are exact — never mix in a
      // distant fallback, which would ghost.
      if (blend && exact && i1 !== i0 && t > 0.02) {
        const b = store.get(i1);
        if (b) {
          ctx.globalAlpha = t;
          ctx.drawImage(b, dx, dy, dw, dh);
          ctx.globalAlpha = 1;
        }
      }

      if (letterboxed && feather) {
        ctx.fillStyle = feather.top;
        ctx.fillRect(0, dy, canvas.width, feather.topH);
        ctx.fillStyle = feather.bottom;
        ctx.fillRect(0, dy + dh - feather.bottomH, canvas.width, feather.bottomH);
      }

      if (canvas.dataset.painted !== 'true') canvas.dataset.painted = 'true';
    }

    function writeVars(p, fp) {
      const key = `${p.toFixed(4)}|${fp.toFixed(4)}`;
      if (key === lastVarsKey) return;
      lastVarsKey = key;
      section.style.setProperty('--p', p.toFixed(4));
      section.style.setProperty('--fp', fp.toFixed(4));
    }

    function frame(now) {
      raf = 0;
      const dt = lastT ? Math.min(now - lastT, 64) : 16.7;
      lastT = now;

      const diff = target - current;
      if (diff > 1e-5) direction = 1;
      else if (diff < -1e-5) direction = -1;

      if (!visible || Math.abs(diff) < 2e-5) {
        current = target;
      } else {
        const rate = reduceMotion.matches ? smoothing * 2.5 : smoothing;
        current = damp(current, target, rate, dt);
      }

      const fp = toFrameProgress(current);
      const f = fp * lastIndex;

      store.focus(Math.round(f), direction);
      if (dirty || f !== lastF) {
        lastF = f;
        dirty = false;
        draw(f);
      }
      writeVars(current, fp);
      optionsRef.current.onProgress?.({ progress: current, frameProgress: fp, frame: f });

      if (current !== target || dirty) raf = requestAnimationFrame(frame);
      else lastT = 0; // idle: stop the loop until the next scroll
    }

    function kick() {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    }

    function resize() {
      const rect = stage.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      scrollable = Math.max(1, section.offsetHeight - h);

      let ratio = Math.min(window.devicePixelRatio || 1, 2);
      ratio = Math.min(ratio, Math.sqrt(tier.maxPixels / (w * h)));
      const pw = Math.round(w * ratio);
      const ph = Math.round(h * ratio);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw; // resizing clears the canvas and resets ctx state
        canvas.height = ph;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      fit = computeFit(pw, ph, tier.width, tier.height, portraitFit, portraitAnchorY);

      // Soft seams where the picture ends inside the canvas (phones). An eased
      // ramp (not a linear one) so there is no visible "edge" to the fade.
      const topH = fit.dh * 0.15;
      const bottomH = fit.dh * 0.12;
      const ramp = (g) => {
        [[0, 1], [0.25, 0.92], [0.55, 0.5], [0.85, 0.1], [1, 0]].forEach(([at, a]) =>
          g.addColorStop(at, `rgba(${bg.join(',')},${a})`),
        );
        return g;
      };
      const top = ramp(ctx.createLinearGradient(0, fit.dy, 0, fit.dy + topH));
      const bottom = ramp(
        ctx.createLinearGradient(0, fit.dy + fit.dh, 0, fit.dy + fit.dh - bottomH),
      );
      feather = { top, bottom, topH, bottomH };

      target = readProgress();
      current = visible ? current : target;
      dirty = true;
      if (lastF >= 0) {
        draw(lastF); // repaint in the same task so resizing never flashes
        dirty = false;
      }
      kick();
    }

    /* ── events ── */
    function onScroll() {
      target = readProgress();
      if (performance.now() < snapUntil) current = target; // restoration: jump, don't play through
      if (!visible) {
        current = target;
        return;
      }
      kick();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resizeObserver.observe(section);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          target = readProgress();
          current = target;
          dirty = true;
          kick();
        }
      },
      { rootMargin: '150px 0px' },
    );
    intersection.observe(section);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', resize);

    /* ── go ── */
    resize();
    current = target;
    const startFrame = Math.round(toFrameProgress(current) * lastIndex);
    lastF = startFrame; // so the first decoded frame triggers a repaint
    store.start(startFrame);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('load', resize);
      resizeObserver.disconnect();
      intersection.disconnect();
      store.destroy();
      if (import.meta.env.DEV) delete window.__seq;
    };
    // The engine is created once; live options are read through optionsRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
