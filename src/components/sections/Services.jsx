import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useContact } from '../../context/ContactContext'
import SectionHeader from '../ui/SectionHeader'
import { img, SERVICE_IMG } from '../../data/imagery'
import { useServices } from '../../hooks/useSiteContent'
import { iconFor } from '../../lib/icons'
import { CountWord } from '../../lib/words'

function ServiceRow({ s, i }) {
  const [open, setOpen] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  /* Content records carry an icon *name*, since the database cannot hold
     a component. Unknown names render the generic mark rather than throw. */
  const Icon = iconFor(s.icon)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.055, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        background: open ? 'var(--bg-card)' : 'transparent',
        transition: 'background 0.3s ease',
        borderRadius: open ? '14px' : 0,
        padding: '0 1.25rem',
        marginLeft: '-1.25rem', marginRight: '-1.25rem',
      }}
    >
      {/* ── Row header ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '1.5rem', padding: '1.625rem 0', cursor: 'default',
      }}>

        {/* Number */}
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
          letterSpacing: '0.1em', width: '2rem', flexShrink: 0,
          color: open ? 'var(--text-primary)' : 'var(--text-muted)',
          transition: 'color 0.25s',
        }}>{s.num}</span>

        {/* Icon pill */}
        <div style={{
          width: '2.2rem', height: '2.2rem', borderRadius: '10px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: open ? 'var(--bg-surface)' : 'var(--bg-card)',
          border: '1px solid var(--border)',
          transition: 'background 0.3s',
        }}>
          <Icon style={{ width: '0.85rem', height: '0.85rem', color: 'var(--text-primary)' }} />
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500, margin: 0, flex: 1,
          fontSize: 'clamp(1.05rem, 2vw, 1.65rem)',
          letterSpacing: '-0.01em',
          color: 'var(--text-primary)',
          transition: 'letter-spacing 0.3s',
        }}>{s.title}</h3>

        {/* Category label — hidden on small screens */}
        <span className="hidden md:block" style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: open ? 'var(--text-secondary)' : 'var(--text-muted)',
          transition: 'color 0.25s', flexShrink: 0,
        }}>{s.cat}</span>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '2rem', height: '2rem', borderRadius: '8px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)',
            background: open ? 'var(--bg-surface)' : 'transparent',
            transition: 'background 0.3s',
          }}
        >
          <ArrowUpRight style={{ width: '0.85rem', height: '0.85rem', color: 'var(--text-secondary)' }} />
        </motion.div>

      </div>

      {/* ── Expandable body ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="svc-body">
              <div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem', lineHeight: 1.75,
                  color: 'var(--text-secondary)', maxWidth: '40rem', marginBottom: '1rem',
                }}>{s.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(s.chips ?? []).map(c => (
                    <span key={c} className="chip" style={{ fontSize: '0.65rem' }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* The row earns an image only once it is open, so the
                  closed list stays a clean index rather than a gallery. */}
              {SERVICE_IMG[s.title] && (
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="svc-shot"
                >
                  <div className="ed-img-wrap" style={{ aspectRatio: '16 / 10' }}>
                    <img
                      src={img(SERVICE_IMG[s.title], 640, 400)}
                      alt=""
                      className="ed-img"
                      loading="lazy"
                      decoding="async"
                      onError={e => e.currentTarget.parentNode.classList.add('ed-failed')}
                    />
                    <span className="ed-grain" aria-hidden="true" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}

export default function Services() {
  const services = useServices()
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { openContact } = useContact()

  return (
    <section id="services" ref={ref} className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">

        <SectionHeader
          num="03"
          label="Services"
          title={[{ t: `${CountWord(services.length)} disciplines, ` }, { t: 'one team', em: true }]}
          subtitle="Most engagements combine two or three: a platform build with the design and infrastructure that go around it."
          action={{ to: '/services', label: 'All services' }}
          inView={inView}
          className="mb-12"
        />

        {/* ── Service rows ── */}
        <div>
          {services.map((s, i) => (
            <ServiceRow key={s.slug ?? s.title} s={s} i={i} />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <div>
            <p className="font-syne font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              Ready to start something great?
            </p>
            <p className="font-mono text-[10px] tracking-widest uppercase mt-1"
              style={{ color: 'var(--text-muted)' }}>
              Let's talk about your project
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={openContact} className="btn btn-primary btn-hover-micro micro-click hover-lift">
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link to="/services" className="btn btn-secondary btn-hover-micro hover-scale">
              All Services
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
