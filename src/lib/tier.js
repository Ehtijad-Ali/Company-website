/**
 * Choose which resolution tier of frames to load. Decided once at mount.
 *
 *  sm  960×540   phones / small tablets, data-saver, low-memory devices
 *  lg  1600×900  everything else
 *
 * `budgetMB` caps decoded-bitmap memory; `maxPixels` caps the canvas backing
 * store so 4K/retina screens don't pay for pixels the 1600px source can't fill.
 */
export function pickTier(tiers) {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const shortSide = Math.min(window.screen?.width || 9999, window.screen?.height || 9999);
  const small =
    shortSide <= 820 || nav.connection?.saveData === true || (nav.deviceMemory && nav.deviceMemory <= 2);

  const key = small && tiers.sm ? 'sm' : 'lg';
  return {
    key,
    ...tiers[key],
    budgetMB: key === 'sm' ? 110 : 288,
    maxPixels: key === 'sm' ? 1.8e6 : 3.4e6,
  };
}
