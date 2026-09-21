import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import { ClipBackground } from '../ui/EditorialImage'
import studioClip from '../../logo/video.mp4'
import { format } from '../../data/metrics'
import { useAbout } from '../../hooks/useSiteContent'
import { E } from '../../lib/motion'

/**
 * The manifesto panel used to repeat the hero headline word for word. Saying
 * the same sentence twice on one page halves the weight of both, so this now
 * carries the operating principle behind the headline instead.
 */
function ManifestoPanel({ inView, manifesto }) {
  const LINES = manifesto?.lines ?? []

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, ease: E }}
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        padding: 0,
        /* `height: 100%` lets the grid row decide the height, so this card
           and the pillars column beside it always finish level. */
        height: '100%',
        minHeight: 460,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--e-1)',
      }}
    >
      {/* The clip fills the card and the copy sits on top of it. */}
      <ClipBackground src={studioClip} label="The studio team working together" />

      <div className="mf-body" style={{
        position: 'relative',
        zIndex: 2,
        padding: '2.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
      }}>

      <div className="flex items-center justify-between" style={{ marginBottom: '2rem', position: 'relative' }}>
        <span className="eyebrow">{manifesto?.eyebrow ?? 'Manifesto'}</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)' }} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        {LINES.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden' }}>
            <motion.div
              initial={{ y: '110%' }}
              animate={inView ? { y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.8, ease: E }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3.4vw, 2.75rem)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                paddingBottom: '0.04em',
              }}
            >
              {line.map((p, pi) =>
                p.em
                  ? <em key={pi} style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>{p.t}</em>
                  : <span key={pi}>{p.t}</span>
              )}
            </motion.div>
          </div>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.85, duration: 0.6 }}
          style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginTop: '1.5rem', maxWidth: '34ch' }}
        >
          Split them across two teams and you get a handoff, a translation
          error, and a month of revisions. So we don't.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="flex items-center justify-between"
        style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', position: 'relative' }}
      >
        <span className="eyebrow">Remote-first</span>
        <span className="eyebrow">{format('countries')} countries served</span>
      </motion.div>
      </div>
    </motion.div>
  )
}

export default function About() {
  const about = useAbout()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" ref={ref} className="relative section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">

        <SectionHeader
          num="02"
          label="About"
          title={[{ t: 'Engineers who design, designers who ' }, { t: 'ship', em: true }]}
          subtitle={`A digital product studio bridging design and engineering for ambitious clients across ${format('countries')} countries.`}
          action={{ to: '/about', label: 'More about us' }}
          inView={inView}
          className="mb-12"
        />

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 xl:gap-14">

          <ManifestoPanel inView={inView} manifesto={about.manifesto} />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: E }}
            className="flex flex-col justify-center"
          >
            <p className="section-sub mb-8">
              Six things you can hold us to on every engagement.
            </p>

            <div style={{ borderTop: '1px solid var(--divider)' }}>
              {(about.pillars ?? []).map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.5, ease: E }}
                  className="flex items-baseline gap-4 py-3"
                  style={{ borderBottom: '1px solid var(--divider)' }}
                >
                  <span className="eyebrow shrink-0" style={{ width: '1.6rem', fontSize: '0.625rem' }}>{p.n}</span>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {p.title}
                    </p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: '0.15rem' }}>
                      {p.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8"
            >
              <Link to="/contact" className="btn btn-primary micro-click">
                Start a project <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
