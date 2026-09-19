export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Frame-rate independent exponential smoothing.
 * Moves `current` toward `target`; `rate` is roughly "1 / time-constant" in 1/s.
 * (rate 6 ≈ 95% of the way there in ~0.5s, at any refresh rate.)
 */
export const damp = (current, target, rate, dtMs) =>
  current + (target - current) * (1 - Math.exp((-rate * dtMs) / 1000));

/**
 * Where to draw a source image of size (sw, sh) inside a canvas (cw, ch).
 *
 * - Wide viewports: plain "cover" so the robot stays as large as possible.
 * - Tall viewports (phones): cover would crop the exploded parts down to the
 *   middle ~30% of the frame, so we blend toward "contain" by `portraitFit`
 *   (1 = pure cover, 0 = pure contain). This leaves a small letterbox that the
 *   renderer feathers into the background. `portraitAnchorY` (< 0.5) lifts the
 *   picture so the bigger share of the letterbox lands at the bottom, where
 *   the copy lives.
 */
export function computeFit(cw, ch, sw, sh, portraitFit = 0.55, portraitAnchorY = 0.36) {
  const contain = Math.min(cw / sw, ch / sh);
  const cover = Math.max(cw / sw, ch / sh);
  const aspect = cw / ch;
  const tallness = clamp((1 - aspect) / 0.35); // 0 for landscape → 1 for phones
  const blend = lerp(1, portraitFit, tallness);
  const scale = lerp(contain, cover, blend);
  const dw = sw * scale;
  const dh = sh * scale;
  const anchorY = lerp(0.5, portraitAnchorY, tallness);
  return { dx: (cw - dw) / 2, dy: (ch - dh) * anchorY, dw, dh };
}
