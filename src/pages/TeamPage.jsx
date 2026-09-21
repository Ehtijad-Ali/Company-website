import React, { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import PageHero, { Em } from '../components/ui/PageHero'
import { ArrowRight, ArrowUpRight, Globe2, Clock, Zap, Heart, MapPin, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatRate } from '../data/team'
import { useTeam, useDepts } from '../hooks/useSiteContent'
import { AvailabilityBadge, Rating } from '../components/team/MemberBits'
import { avatarFallback } from '../lib/avatar'

const SORTS = [
  { id: 'featured',  label: 'Featured' },
  { id: 'rate-asc',  label: 'Rate: low to high' },
  { id: 'rate-desc', label: 'Rate: high to low' },
  { id: 'rating',    label: 'Highest rated' },
]

/**
 * One roster card — a directory entry, so rate and availability lead.
 *
 * forwardRef because AnimatePresence's popLayout mode attaches a ref to each
 * child to measure it; a plain function component would drop it silently and
 * break the exit animation.
 */
const MemberCard = React.forwardRef(function MemberCard({ m, i }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (i % 4) * 0.07, duration: 0.5 }}
    >
      <Link to={`/team/${m.slug}`} className="card flex flex-col h-full" style={{ padding: '1.125rem' }}>
        <div className="relative mb-4">
          <img
            src={m.img} alt={m.name}
            className="w-full object-cover member-photo"
            style={{ aspectRatio: '4/3', objectPosition: 'top', borderRadius: 'var(--r-md)' }}
            onError={avatarFallback(m.name, 400)}
          />
          <span className="absolute chip" style={{ top: 10, left: 10, background: 'var(--bg-card)' }}>{m.dept}</span>
        </div>

        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 500, lineHeight: 1.25, color: 'var(--text-primary)' }}>
            {m.name}
          </h3>
          <ArrowUpRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)', marginTop: 3 }} />
        </div>

        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.875rem', color: 'var(--brand)', marginBottom: '0.75rem' }}>
          {m.role}
        </p>

        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '0.875rem', flex: 1 }}>
          {m.tagline}
        </p>

        <div className="flex items-center justify-between gap-2 mb-3" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> {m.location}
          </span>
          <Rating value={m.stats?.rating} />
        </div>

        <div className="flex items-center justify-between gap-2"
          style={{ paddingTop: '0.875rem', borderTop: '1px solid var(--divider)' }}>
          <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
            {formatRate(m.rate)}
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/hr</span>
          </span>
          <AvailabilityBadge status={m.availability} />
        </div>
      </Link>
    </motion.div>
  )
})

export default function TeamPage() {
  const TEAM = useTeam()
  const DEPTS = useDepts()
  const [dept, setDept] = useState('All')
  const [sort, setSort] = useState('featured')

  const visible = useMemo(() => {
    const list = dept === 'All' ? [...TEAM] : TEAM.filter(m => m.dept === dept)
    switch (sort) {
      case 'rate-asc':  return list.sort((a, b) => a.rate - b.rate)
      case 'rate-desc': return list.sort((a, b) => b.rate - a.rate)
      case 'rating':    return list.sort((a, b) => (b.stats?.rating ?? 0) - (a.stats?.rating ?? 0))
      default:          return list
    }
  }, [TEAM, dept, sort])

  const openNow = TEAM.filter(m => m.availability === 'available').length
  /* Math.min() of nothing is Infinity — guard so an empty roster cannot
     render "from $Infinity" while the API is unreachable. */
  const lowestRate = TEAM.length ? Math.min(...TEAM.map(m => m.rate)) : 0

  return (
    <>
      <PageHero
        label="Team"
        title={<>Hire the <Em>individual</Em>, not just the agency</>}
        sub={<>Every person here can be engaged directly, by the hour, for a sprint, or embedded in your team.
          {' '}{openNow} available now, from {formatRate(lowestRate)}/hr.</>}
      />

      <section className="section" style={{ background: 'var(--bg-surface)' }}>
        <div className="container">

          {/* Filters */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex flex-wrap">
              {DEPTS.map(d => (
                <button key={d} onClick={() => setDept(d)}
                  className="relative pb-3 mr-6 eyebrow"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: dept === d ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                  {d}
                  {dept === d && (
                    <motion.div layoutId="teampage-underline"
                      style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1.5, background: 'var(--brand)' }}
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }} />
                  )}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 pb-2.5">
              <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span className="sr-only">Sort by</span>
              <select
                value={sort} onChange={e => setSort(e.target.value)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-secondary)',
                  background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none',
                  minHeight: 44,  // native selects collapse to ~16px on mobile
                }}>
                {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {visible.map((m, i) => <MemberCard key={m.slug} m={m} i={i} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <JoinUsSection />
    </>
  )
}

const OPEN_ROLES = [
  { title: 'Senior React Engineer',     dept: 'Engineering', type: 'Full-time · Remote',  desc: 'Build complex, performant UIs for our most demanding clients. 5+ years React required.' },
  { title: 'AI/ML Engineer',            dept: 'AI/ML',       type: 'Full-time · Remote',  desc: 'Design and ship production LLM pipelines, RAG systems, and fine-tuning workflows.' },
  { title: 'Product Designer',          dept: 'Design',      type: 'Full-time · Remote',  desc: 'Craft end-to-end product experiences from zero. Figma expert with a portfolio that proves it.' },
  { title: 'Growth Marketing Manager',  dept: 'Marketing',   type: 'Full-time · Remote',  desc: 'Own our paid and organic growth channels. Data-driven, experiment-first mindset essential.' },
]

const PERKS = [
  { icon: Globe2, label: '100% Remote',         desc: 'Work from anywhere. The team is spread across six Pakistani cities.' },
  { icon: Clock,  label: 'Async-first culture', desc: 'No mandatory stand-ups. Deep work is protected.' },
  { icon: Zap,    label: '20% R&D time',        desc: 'Dedicated learning hours built into every quarter.' },
  { icon: Heart,  label: 'Top-of-market pay',   desc: 'Competitive salary + equity + full benefits.' },
]

function JoinUsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>/ 02 · Careers</p>
          <div className="flex items-end gap-6">
            <h2 className="section-title shrink-0">Join the Team</h2>
            <div className="flex-1 h-px mb-2.5" style={{ background: 'var(--border)' }} />
            <span className="font-syne font-extrabold hidden lg:block shrink-0 select-none"
              style={{ fontSize: 'clamp(3.5rem,6vw,6rem)', lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px var(--ghost-stroke)', letterSpacing: '-0.04em' }}>02</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            We hire exceptional people and get out of their way. If you're obsessed with craft and love working on hard problems, you'll fit right in.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10">

          {/* Open roles */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Open positions</p>
            <div className="space-y-3">
              {OPEN_ROLES.map((role, i) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="group card p-6 flex items-start justify-between gap-4"
                  style={{ borderRadius: 14, cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = ''}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-syne font-bold text-base" style={{ color: 'var(--text-primary)' }}>{role.title}</h3>
                      <span className="chip text-[10px]">{role.dept}</span>
                    </div>
                    <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text-muted)' }}>{role.type}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{role.desc}</p>
                  </div>
                  <Link to="/contact"
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors group-hover:border-accent"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--text-muted)' }}>Why you'll love it here</p>
            <div className="space-y-3">
              {PERKS.map(({ icon: Icon, label, desc }, i) => (
                <div key={label} className="card p-5 flex items-start gap-4" style={{ borderRadius: 14 }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-syne font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 card p-5 flex flex-col gap-3" style={{ borderRadius: 14, borderColor: 'var(--accent)', borderWidth: 1 }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Don't see your role? We hire for attitude and aptitude, so send us your work.</p>
              <Link to="/contact" className="btn btn-primary w-full justify-center text-sm py-2.5">
                Send a Speculative Application <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
