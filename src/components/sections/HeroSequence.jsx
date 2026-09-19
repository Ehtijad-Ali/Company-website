import React, { useLayoutEffect, useRef } from 'react'
import ScrollSequence from '../ui/ScrollSequence'
import manifest from '../../data/frames.manifest.json'

/* The site's dark ground. The canvas fills any letterbox with it, and the
   plate treatment in CSS grades the frames into the page from there. */
const GROUND = '#14100E'

/**
 * Pins the hero over a scroll-scrubbed frame sequence.
 *
 * The frames are an absolute layer spanning the whole wrapper, and their
 * sticky stage holds the viewport. The hero sits on top in normal flow and
 * is sticky too, so it stays put while the frames play; the spacer after it
 * (`--hero-seq-pin`) is that scroll distance. A hero taller than the screen
 * (phones) scrolls until its bottom edge is in view, then holds. Past the
 * spacer the pin releases and the page scrolls on; scrolling back up
 * re-enters it and the engine runs the same mapping in reverse.
 *
 * Nothing here is time-based: every scroll position maps to one frame, so
 * the sequence is exactly reversible.
 */
export default function HeroSequence({ children }) {
  const wrapRef = useRef(null)
  const contentRef = useRef(null)

  // Written straight to a CSS variable, so resizing never re-renders the hero.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const content = contentRef.current
    if (!wrap || !content) return undefined
    const ro = new ResizeObserver(() => {
      wrap.style.setProperty('--hero-h', `${content.offsetHeight}px`)
    })
    ro.observe(content)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="hero-seq">
      <ScrollSequence
        className="hero-seq__bg"
        manifest={manifest}
        holdStart={0.04}
        holdEnd={0.1}
        smoothing={6}
        background={GROUND}
        label="A neural network drawn frame by frame as you scroll"
      >
        {/* The veil the texture plates wear, so the copy keeps its contrast. */}
        <div className="hero-seq__veil" />
      </ScrollSequence>

      <div ref={contentRef} className="hero-seq__content">{children}</div>
      <div className="hero-seq__pin" aria-hidden="true" />
    </div>
  )
}
