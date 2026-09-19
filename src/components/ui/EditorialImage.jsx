import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { E } from '../../lib/motion'

/**
 * The single image treatment for the site.
 *
 * Everything visual goes through here so the photography reads as one
 * art direction rather than a stock search: the same warm grade, the
 * same grain, the same reveal. The grade is deliberately heavy at rest
 * and lifts on hover, which keeps the page reading as type first.
 *
 * `parallax` is a percentage of drift across the scroll range. Anything
 * above ~8 starts to look like a bug rather than an effect, and the
 * image is scaled up to cover the travel so no edge is ever exposed.
 */
export default function EditorialImage({
  src,
  alt = '',
  ratio = '4 / 3',
  parallax = 0,
  eyebrow,
  caption,
  flush = false,
  priority = false,
  className = '',
  style,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])

  const moves = parallax > 0 && !reduce

  return (
    <motion.figure
      ref={ref}
      className={`ed-fig ${className}`}
      /* No inline margin: it would outrank the class the caller passed. */
      style={style}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: E }}
    >
      <div
        className={`ed-img-wrap${flush ? ' ed-flush' : ''}${moves ? ' ed-parallax' : ''}`}
        /* Handed over as a custom property rather than an inline
           `aspect-ratio`, so a layout can still override the shape from
           a stylesheet — an inline value would outrank any class rule. */
        style={{ '--ed-ratio': ratio }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="ed-img"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={moves ? { y: drift, scale: 1.18 } : undefined}
          onError={e => e.currentTarget.parentNode.classList.add('ed-failed')}
        />
        <span className="ed-grain" aria-hidden="true" />
        {(eyebrow || caption) && (
          <figcaption className="ed-cap">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {caption && <span className="ed-cap-text">{caption}</span>}
          </figcaption>
        )}
      </div>
    </motion.figure>
  )
}

/**
 * A self-hosted clip wearing the same frame as `EditorialImage`.
 *
 * Plays muted, on a loop, with no chrome, so it reads as motion design
 * rather than as a video player — which is the only way a short loop
 * works in an editorial band. It carries the same grade and grain as the
 * stills so the band holds together.
 *
 * Autoplay is dropped for anyone who has asked for reduced motion; they
 * get the same frame with native controls instead.
 */
export function EditorialClip({
  src,
  poster,
  label = 'Studio footage',
  ratio = '16 / 10',
  eyebrow,
  caption,
  flush = false,
  className = '',
  style,
}) {
  const videoRef = useRef(null)
  const reduce = useReducedMotion()

  /* React has a long-standing habit of dropping the `muted` attribute on
     the initial render, and an unmuted video is refused autoplay by every
     browser. Setting it on the element directly is the reliable fix. */
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    if (!reduce) el.play().catch(() => {})
  }, [reduce])

  return (
    <motion.figure
      className={`ed-fig ${className}`}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: E }}
    >
      <div className={`ed-img-wrap${flush ? ' ed-flush' : ''}`} style={{ '--ed-ratio': ratio }}>
        <video
          ref={videoRef}
          className="ed-img"
          src={src}
          poster={poster}
          aria-label={label}
          autoPlay={!reduce}
          loop={!reduce}
          muted
          playsInline
          controls={reduce}
          preload="metadata"
        />
        <span className="ed-grain" aria-hidden="true" />
        {(eyebrow || caption) && (
          <figcaption className="ed-cap">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            {caption && <span className="ed-cap-text">{caption}</span>}
          </figcaption>
        )}
      </div>
    </motion.figure>
  )
}

/**
 * The same clip, but filling its container rather than setting its own
 * shape — for when copy sits on top of the footage instead of beside it.
 *
 * Ships its own scrim, because legible text over moving video is not
 * something you can leave to chance: the frame behind any given word
 * changes 30 times a second.
 */
export function ClipBackground({ src, label = 'Studio footage', scrim = 0.72 }) {
  const videoRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.muted = true
    if (!reduce) el.play().catch(() => {})
  }, [reduce])

  return (
    <div className="ed-fill" aria-hidden="true">
      <video
        ref={videoRef}
        className="ed-fill-video"
        src={src}
        aria-label={label}
        autoPlay={!reduce}
        loop={!reduce}
        muted
        playsInline
        preload="metadata"
      />
      <span className="ed-grain" />
      <span className="ed-fill-scrim" style={{ '--scrim': scrim }} />
    </div>
  )
}

/**
 * A texture sat behind an entire section. Purely decorative, so it is
 * hidden from assistive tech and never carries meaning that the copy
 * does not already state.
 */
export function ImagePlate({ src, opacity, eager = false, parallax = 7 }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])
  const moves = parallax > 0 && !reduce

  return (
    <div ref={ref} className="ed-plate" aria-hidden="true" style={opacity != null ? { opacity } : undefined}>
      {/* Above-the-fold plates load eagerly; everything below waits its turn.
          The drift is what stops a section reading as a flat panel — the
          ground moves slower than the type sitting on it. Scaled up to
          cover the travel so no edge is ever exposed. */}
      <motion.img src={src} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async"
        fetchPriority={eager ? 'high' : undefined}
        style={moves ? { y: drift, scale: 1.18 } : undefined}
        onError={e => { e.currentTarget.style.display = 'none' }} />
    </div>
  )
}
