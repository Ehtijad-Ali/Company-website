/**
 * Motion primitives shared across the site.
 *
 * `E` was declared identically in fifteen files. One copy means a change to
 * the site's easing is a change to the site, not to fifteen files that have
 * to be found first.
 */

/** The house ease-out. Matches `--ease` in index.css. */
export const E = [0.22, 1, 0.36, 1]
