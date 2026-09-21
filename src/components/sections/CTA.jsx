import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, MessageSquare, CalendarCheck } from 'lucide-react'
import { useContact } from '../../context/ContactContext'
import { formatRate } from '../../data/team'
import { useTeam } from '../../hooks/useSiteContent'
import { ImagePlate } from '../ui/EditorialImage'
import { img, TEXTURE } from '../../data/imagery'
import { E } from '../../lib/motion'


/**
 * The closing ask.
 *
 * The home page previously ended on testimonials — it never asked for the
 * business. Two routes out, because there are two kinds of visitor here: one
 * with a whole project to scope, and one who just wants a specific
 * specialist for a few weeks.
 */
export default function CTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { openContact } = useContact()

  const team = useTeam()
  const openNow = team.filter(m => m.availability === 'available').length
  const lowestRate = team.length ? Math.min(...team.map(m => m.rate)) : 0

  return (
    <section ref={ref} className="section relative" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Clay texture behind the closing ask. Knocked back hard enough
          that it registers as warmth rather than as a photograph. */}
      <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} />
      <div className="container relative" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: E }}
          className="relative overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)',
            padding: 'clamp(2.25rem, 5vw, 4rem)',
            boxShadow: 'var(--e-2)',
          }}
        >
          <div className="pointer-events-none absolute inset-0" style={{
            background: 'radial-gradient(ellipse 60% 90% at 85% 10%, var(--accent-glow), transparent 70%)',
          }} />

          <div className="relative grid lg:grid-cols-[1.15fr_1fr] gap-10 xl:gap-16 items-center">

            <div>
              <p className="eyebrow mb-4">Next step</p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-4)',
                fontWeight: 500, lineHeight: 1.08, letterSpacing: '-0.025em',
                color: 'var(--text-primary)', textWrap: 'balance',
              }}>
                Tell us what you're building
                {' '}<em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>and we'll tell you what it takes</em>
              </h2>
              <p className="section-sub mt-5" style={{ maxWidth: '44ch' }}>
                A short discovery call, an honest scope, and a milestone plan before
                anyone signs anything. We'll say so if we're the wrong fit.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/contact" className="btn btn-primary micro-click">
                  Start a project <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={openContact} className="btn btn-secondary">
                  <MessageSquare className="w-4 h-4" /> Ask a question
                </button>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
                Replies within one business day. No sales sequence.
              </p>
            </div>

            {/* Second route: hire one person rather than scope a project */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: '1.75rem',
            }}>
              <div className="flex items-center gap-2 mb-3">
                <CalendarCheck className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>Just need one person?</span>
              </div>

              <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Every specialist here can be engaged directly, by the hour, for a
                sprint, or embedded in your team.
              </p>

              <div className="flex items-center gap-6 mb-5" style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--divider)' }}>
                <div>
                  <p className="tnum" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', fontWeight: 500, lineHeight: 1, color: 'var(--text-primary)' }}>
                    {openNow}
                  </p>
                  <p className="eyebrow mt-1.5" style={{ fontSize: '0.625rem' }}>Available now</p>
                </div>
                <div style={{ width: 1, height: 32, background: 'var(--divider)' }} />
                <div>
                  <p className="tnum" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', fontWeight: 500, lineHeight: 1, color: 'var(--text-primary)' }}>
                    {formatRate(lowestRate)}
                  </p>
                  <p className="eyebrow mt-1.5" style={{ fontSize: '0.625rem' }}>Starting rate / hr</p>
                </div>
              </div>

              <Link to="/team" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
                Browse the team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
