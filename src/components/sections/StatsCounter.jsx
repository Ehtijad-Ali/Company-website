import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Users, CalendarDays, Star } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import { METRICS } from '../../data/metrics'
import { E, DUR, RISE } from '../../lib/motion'

const KEYS = ['projects', 'satisfaction', 'avgExperience', 'rating']
const ICONS = { projects: Rocket, satisfaction: Users, avgExperience: CalendarDays, rating: Star }
const STATS = KEYS.map(k => {
  const m = METRICS[k]
  return { end: m.value, prefix: m.prefix, suffix: m.suffix, decimals: m.decimals ?? 0,
           label: m.label, desc: m.desc, Icon: ICONS[k] }
})

function Counter({ end, prefix = '', suffix = '', decimals = 0, inView }) {
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const duration = 1800
    const startTime = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(+(end * eased).toFixed(decimals))
      if (p < 1) requestAnimationFrame(tick)
      else setVal(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end, decimals])

  return (
    <span style={{ color: 'var(--text-primary)' }}>
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  )
}

export default function StatsCounter() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">

        {/* Header */}
        <SectionHeader
          num="04"
          label="Impact"
          title={[{ t: 'Numbers that ' }, { t: 'move the needle', em: true }]}
          inView={inView}
          className="mb-12"
        />

        {/* Stats sit straight on the section ground — no cards. A hairline
            between them does the separating that boxes used to. */}
        <div className="stat-row">
          {STATS.map(({ Icon, ...stat }, i) => (
            <motion.div
              key={stat.label}
              initial={{opacity: 0, y: RISE }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{delay: 0.15 + i * 0.1, duration: DUR.reveal, ease: E }}
              className="stat-cell group"
            >
              {/* Flat, so `.stat-cell`'s grid can place the badge beside the
                  number on wide screens and alongside the whole block on a
                  phone without the markup changing. */}
              <span className="stat-badge">
                <Icon aria-hidden="true" />
              </span>

              <p className="stat-value tnum leading-none"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500,
                         fontSize: 'clamp(2.1rem,4.2vw,3.4rem)', letterSpacing: '-0.03em',
                         color: 'var(--text-primary)' }}>
                <Counter {...stat} inView={inView} />
              </p>

              <p className="stat-label font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>

              <p className="stat-desc text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing statement — a rule above it, not a box around it. */}
        <motion.div
          initial={{opacity: 0, y: RISE }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{delay: 0.65, duration: DUR.reveal, ease: E }}
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="font-mono text-xs text-center sm:text-left" style={{ color: 'var(--text-secondary)' }}>
            Every metric above is tracked, reported, and verifiable, with no made-up numbers.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--primary)' }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Updated quarterly
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
