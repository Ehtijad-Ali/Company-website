import React, { useCallback, useLayoutEffect, useRef } from 'react'
import ScrollSequence from '../ui/ScrollSequence'
import manifest from '../../data/frames.manifest.json'

/* The site's dark ground. The canvas fills any letterbox with it, and the
   plate treatment in CSS grades the frames into the page from there. */
const GROUND = '#14100E'

/* Where the hero hands the screen over to the sequence, in section
   progress. Before REVEAL_IN the copy is at full strength; past
   REVEAL_OUT it is gone and the frames are on their own. */
const REVEAL_IN = 0.06
const REVEAL_OUT = 0.34

/* And where the flanking copy answers it. It picks up the moment the hero
   copy has finished leaving, so the two never share the screen but nothing
   is left blank in between either — at 0.40 the columns did not finish
   arriving until halfway through the pin, which is easy to scroll straight
   past and read as nothing being there at all. */
const ASIDE_IN = 0.34
const ASIDE_OUT = 0.46

/* The captions either side of the figure, left column then right. They
   run as one argument alternating across it — I sets the problem, II
   answers it, III and IV say who does it and how fast — so the robot reads
   as the thing being described rather than a backdrop with labels stuck on.
   Set like plates in a book: a small roman label, a rule, then the line at
   display size with the turn of the sentence carried in italic. */
/* Every line is broken by hand. Left to wrap, each plate changed its line
   count at different widths — a two-line plate opposite a one-line one, and
   a different pair at the next breakpoint. Fixed breaks keep all four the
   same shape at every size. */
const PLATES = [
  {
    label: 'Plate I',
    sub: 'On making',
    line: [{ t: 'Everything ' }, { t: 'arrives', em: true }, { br: true }, { t: 'in pieces.' }],
  },
  {
    label: 'Plate II',
    sub: 'On shipping',
    line: [{ t: 'We hand it over' }, { br: true }, { t: 'whole', em: true }, { t: '.' }],
  },
  {
    label: 'Plate III',
    sub: 'On the team',
    line: [{ t: 'Ten specialists,' }, { br: true }, { t: 'no', em: true }, { t: ' handoffs.' }],
  },
  {
    label: 'Plate IV',
    sub: 'On pace',
    line: [{ t: 'Measured in' }, { br: true }, { t: 'weeks', em: true }, { t: '.' }],
  },
]

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
 * Once the sequence is underway the hero clears out: the copy, terminal and
 * strips fade off and the veil that was holding them legible lifts with
 * them, so the middle of the pin is the robot alone, full frame. The hero
 * cannot drive that itself — it is sticky, so its own scroll progress
 * freezes the moment it pins — so the reveal rides the same progress value
 * the engine scrubs the frames with, written to a CSS variable rather than
 * to state so it costs no re-renders.
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

  const handleProgress = useCallback(({ progress }) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const t = (progress - REVEAL_IN) / (REVEAL_OUT - REVEAL_IN)
    const reveal = t < 0 ? 0 : t > 1 ? 1 : t
    wrap.style.setProperty('--hero-reveal', reveal.toFixed(4))

    const a = (progress - ASIDE_IN) / (ASIDE_OUT - ASIDE_IN)
    wrap.style.setProperty('--hero-aside', (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(4))
    // Fully faded copy still sits in the layout, so take it out of reach.
    const gone = reveal > 0.99 ? 'true' : 'false'
    if (wrap.dataset.revealed !== gone) wrap.dataset.revealed = gone
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
        onProgress={handleProgress}
        label="A humanoid robot assembling itself, scrubbed frame by frame as you scroll"
      >
        {/* The veil the texture plates wear, so the copy keeps its contrast.
            It lifts with the copy — nothing left to protect. */}
        <div className="hero-seq__veil" />
        {/* The second act. Once the hero copy is gone the frames are alone
            on screen for most of the pin, which is a long time to look at
            a robot and be told nothing. These two columns take the margins
            the figure leaves empty and say what the studio does and what it
            has done. Marked decorative: every line is repeated verbatim by
            the services grid and the stats strip further down, so a screen
            reader gains nothing but the duplication. */}
        <div className="hero-seq__aside" aria-hidden="true">
          <div className="container hero-seq__aside-row">
            {PLATES.map((c, i) => (
              <figcaption
                key={c.label}
                className={`hero-seq__plate${i % 2 ? ' hero-seq__plate--end' : ''}`}
              >
                <p className="hero-seq__plate-label">
                  <span>{c.label}</span>
                  <span className="hero-seq__plate-sub">{c.sub}</span>
                </p>
                <p className="hero-seq__plate-line">
                  {c.line.map((part, pi) =>
                    part.br
                      ? <br key={pi} />
                      : part.em
                        ? <em key={pi}>{part.t}</em>
                        : <span key={pi}>{part.t}</span>
                  )}
                </p>
              </figcaption>
            ))}
          </div>
        </div>

      </ScrollSequence>

      <div ref={contentRef} className="hero-seq__content">{children}</div>
      <div className="hero-seq__pin" aria-hidden="true" />
    </div>
  )
}
