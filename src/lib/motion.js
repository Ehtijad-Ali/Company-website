/**
 * The site's motion language, in one place.
 *
 * Content arrives one way everywhere: it fades in while rising RISE pixels,
 * over DUR.reveal, on the house ease-out. Nothing slides in from the side
 * and nothing scales up out of nowhere — sections used to pick their own
 * distance (12 to 40px), their own direction and one of twenty durations,
 * which is what made the page read as assembled rather than designed.
 *
 * Interface feedback (hover, press, toggles) is a separate, faster tier and
 * lives mostly in CSS as --dur-fast / --dur.
 *
 * Headline lines rising out of a mask (`y: '104%'`) are the one signature
 * move, kept for page-level headlines only.
 */

/** The house ease-out. Matches `--ease` in index.css. */
export const E = [0.22, 1, 0.36, 1]

/** Seconds. `ui` for state changes, `reveal` for content arriving. */
export const DUR = { ui: 0.25, reveal: 0.7 }

/** How far content rises as it arrives. One distance, one direction. */
export const RISE = 24

/** Delay between siblings arriving together. */
export const STAGGER = 0.08
