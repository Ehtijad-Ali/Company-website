import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { formatRate } from '../../data/team'
import { useTeam, useDepts } from '../../hooks/useSiteContent'
import { AvailabilityBadge } from '../team/MemberBits'
import { avatarFallback } from '../../lib/avatar'



function Card({ m, i }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (i % 4) * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/team/${m.slug}`}
        className="shadow-elevate block"
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 'var(--r-lg)',
          aspectRatio: '3/4', border: '1px solid var(--border)', display: 'block',
        }}
      >
        <motion.img
          src={m.img} alt={m.name}
          animate={{ scale: hovered ? 1.06 : 1, filter: hovered ? 'grayscale(0%)' : 'grayscale(55%)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="member-photo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          onError={avatarFallback(m.name, 600)}
        />

        {/* Warm scrim, tinted to the palette rather than neutral black */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(20,16,14,0.96) 0%, rgba(20,16,14,0.62) 38%, rgba(20,16,14,0.08) 68%, transparent 100%)',
        }} />

        {/* Rate — the thing a visitor is scanning for */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '0.3rem 0.6rem', borderRadius: 'var(--r-full)',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.16)',
          backdropFilter: 'blur(8px)',
        }}>
          <span className="tnum" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#FFFCF8' }}>
            {formatRate(m.rate)}
            <span style={{ fontSize: '0.625rem', opacity: 0.65 }}>/hr</span>
          </span>
        </div>

        <div style={{
          position: 'absolute', top: 14, left: 14,
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em',
        }}>{String(i + 1).padStart(2, '0')}</div>

        {/* Slide-up panel */}
        <motion.div
          animate={{ y: hovered ? 0 : 'calc(100% - 78px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: '0 0 0 0', top: 'auto', padding: '1.125rem' }}
        >
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: hovered ? 0.16 : 0 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}
          >
            {(m.skills ?? []).slice(0, 3).map(s => (
              <span key={s.name} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                padding: '0.2rem 0.5rem', borderRadius: 'var(--r-full)',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.62)',
              }}>{s.name}</span>
            ))}
          </motion.div>

          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.0625rem',
            color: '#FFFCF8', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2,
          }}>{m.name}</h3>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginTop: '0.3rem',
          }}>{m.role}</p>

          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: hovered ? 0.2 : 0 }}
            style={{ marginTop: '0.75rem' }}
          >
            <p style={{ fontSize: '0.75rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', marginBottom: '0.75rem' }}>
              {m.tagline}
            </p>
            <span className="inline-flex items-center gap-1.5" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5875rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#FFFCF8',
            }}>
              View profile <ArrowUpRight className="w-3 h-3" />
            </span>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Team() {
  const team = useTeam()
  const allDepts = useDepts()
  const [dept, setDept] = useState('All')

  /* The home section shows a curated subset; /team has the full roster.
     The chips are built from the people actually shown, so filtering the
     home section can never land on an empty result. */
  const featured = team.slice(0, 8)
  const depts = allDepts.filter(d => d === 'All' || featured.some(m => m.dept === d))
  const filtered = dept === 'All' ? featured : featured.filter(m => m.dept === dept)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="team" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="eyebrow mb-3">
              <span style={{ color: 'var(--brand)' }}>05</span>
              <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>Team
            </p>
            <h2 className="section-title">
              The <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>people</em>,
              {' '}bookable by the hour
            </h2>
            <p className="section-sub mt-4">
              Engage any specialist directly, with rates and availability on every profile.
            </p>
          </div>
          <Link to="/team"
            className="tap shrink-0 mb-2 flex items-center gap-2 text-sm"
            style={{ color: 'var(--text-secondary)' }}>
            View all {team.length}
            <span style={{
              width: 30, height: 30, borderRadius: 'var(--r-sm)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border)', background: 'var(--bg-card)',
            }}>
              <ArrowUpRight style={{ width: 13, height: 13, color: 'var(--text-secondary)' }} />
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap mb-8"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {depts.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className="relative pb-3 mr-6 eyebrow"
              style={{
                color: dept === d ? 'var(--text-primary)' : 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {d}
              {dept === d && (
                <motion.div
                  layoutId="team-underline"
                  style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1.5, background: 'var(--brand)' }}
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <motion.div key={m.slug} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card m={m} i={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="section-sub" style={{ padding: '2rem 0' }}>
            No featured team members in {dept}. <Link to="/team" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>See the full roster</Link>.
          </p>
        )}
      </div>
    </section>
  )
}
