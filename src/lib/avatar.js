/**
 * Fallback for a portrait that fails to load.
 *
 * Seven components each inlined this same ui-avatars URL with the same
 * brand colours; two of them forgot to encode the name, so any person with
 * a space in theirs got a broken request back. One helper, encoded once.
 */
const BG = 'C96A4A'   // --terracotta-500
const FG = 'FFFCF8'   // --bg-card, light

/**
 * `onError` handler that swaps a broken image for initials on brand ground.
 *   <img src={m.img} onError={avatarFallback(m.name, 600)} />
 */
export const avatarFallback = (name, size = 400) => e => {
  const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&bg=${BG}&color=${FG}&bold=true&size=${size}`
  /* Guard against a loop: if the fallback itself 404s, stop swapping. */
  if (e.currentTarget.src === url) return
  e.currentTarget.src = url
}
