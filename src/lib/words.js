/**
 * Numbers written out, for headlines.
 *
 * "Eight disciplines" and "Ten specialists" used to be typed into the copy
 * beside a list that could change. Now the count comes from the content, and
 * the headline spells it the way a person would up to twelve, then falls
 * back to digits — "Thirteen disciplines" starts to read like a spelling bee.
 */
const WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
]

export const countWord = n =>
  Number.isInteger(n) && n >= 0 && n < WORDS.length ? WORDS[n] : String(n)

/** Same, capitalised, for the start of a sentence or a headline. */
export const CountWord = n => {
  const w = countWord(n)
  return w.charAt(0).toUpperCase() + w.slice(1)
}
