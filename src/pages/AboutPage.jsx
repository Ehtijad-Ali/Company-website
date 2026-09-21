import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, FlaskConical, Zap, Heart } from 'lucide-react'
import Process from '../components/sections/Process'
import SectionHeader from '../components/ui/SectionHeader'
import EditorialImage, { ImagePlate } from '../components/ui/EditorialImage'
import { img, STUDIO, TEXTURE } from '../data/imagery'
import { METRICS, format, FOUNDED, TEAM_SIZE } from '../data/metrics'
import { useAbout, useTeam } from '../hooks/useSiteContent'
import { iconFor } from '../lib/icons'
import { E } from '../lib/motion'


/* ── 01 · Opening statement ─────────────────────────────────────────── */
function Opening() {
  const about = useAbout()
  /* Headcount comes from the roster itself rather than metrics.TEAM_SIZE:
     adding someone in the admin should change this line the same day, not
     at the next deploy. */
  const teamSize = useTeam().length || TEAM_SIZE
  const facts = [
    ['Founded', FOUNDED],
    ['Team', `${teamSize} people`],
    ['Clients in', `${format('countries')} countries`],
    ['Projects', format('projects')],
  ]

  return (
    <section className="section pt-36 relative" style={{ background: 'var(--bg-surface)', paddingBottom: '4rem', overflow: 'hidden' }}>
      {/* The Contact hero's ground, so every page opens in the same room. */}
      <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} />
      <div className="container relative" style={{ zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E }}
          className="eyebrow mb-8"
        >
          <span style={{ color: 'var(--brand)' }}>01</span>
          <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>About
        </motion.p>

        {/* The statement carries the page — no competing headline above it.
            No width cap here: the reveal wrapper's overflow:hidden clips on
            both axes, so a narrow container silently truncates the glyphs. */}
        <div>
          {(about.opening?.headline ?? []).map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: '104%' }} animate={{ y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: E }}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--step-6)',
                  fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.03em',
                  color: 'var(--text-primary)', paddingBottom: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {line.map((p, pi) => p.em
                  ? <em key={pi} style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>{p.t}</em>
                  : <span key={pi}>{p.t}</span>)}
              </motion.h1>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: E }}
          className="section-sub"
          style={{ marginTop: '2rem', fontSize: '1.125rem', maxWidth: '52ch' }}
        >
          {(about.opening?.intro ?? '').replace('{teamSize}', teamSize)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="fact-grid"
          style={{ marginTop: '3.5rem' }}
        >
          {facts.map(([k, v]) => (
            <div key={k}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{k}</p>
              <p className="tnum" style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)',
                fontWeight: 500, lineHeight: 1.1, color: 'var(--text-primary)',
              }}>{v}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ── 02 · The story ─────────────────────────────────────────────────── */
function Story() {
  const { story = {}, milestones = [] } = useAbout()
  const paragraphs = story.paragraphs ?? []
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHeader
          num="02"
          label="Story"
          title={[{ t: 'Built to be the studio we ' }, { t: 'would have hired', em: true }]}
          inView={inView}
          className="mb-12"
        />

        {/* A wide plate under the story header. Parallax here rather
            than on the smaller frames: it has the width to carry it. */}
        <EditorialImage
          src={img(STUDIO.homeStudio, 1600, 700)}
          alt="A working studio, mid-project"
          ratio="21 / 9"
          parallax={7}
          eyebrow="Founded 2025"
          caption={story.caption}
          className="mb-14"
        />

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 xl:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: E }}
            className="dropcap prose-measure"
          >
            {/* The quote is set after the second paragraph, so the prose
                is rendered in two runs around it. Both runs are siblings in
                this div, so the keys have to be unique across both. */}
            {paragraphs.slice(0, 2).map((p, i) => <p key={`p${i}`}>{p}</p>)}

            <motion.blockquote
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="pull-quote"
              style={{ margin: '2.5rem 0' }}
            >
              {story.quote}
            </motion.blockquote>

            {paragraphs.slice(2).map((p, i) => <p key={`p${i + 2}`}>{p}</p>)}

            <Link to="/contact" className="btn btn-primary micro-click" style={{ marginTop: '2rem' }}>
              Start a project <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: E }}
          >
            <p className="eyebrow mb-6">Milestones</p>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '2.65rem', top: '0.6rem', bottom: '0.6rem',
                width: 1, background: 'var(--divider)',
              }} />
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: E }}
                  className="flex gap-5"
                  style={{ paddingBottom: i < milestones.length - 1 ? '1.75rem' : 0 }}
                >
                  <span className="tnum shrink-0" style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 500,
                    color: 'var(--brand)', width: '2.1rem', lineHeight: 1.35,
                  }}>{m.year}</span>

                  <span className="shrink-0" style={{
                    width: 9, height: 9, borderRadius: '50%', marginTop: '0.42rem',
                    background: 'var(--bg)', border: '1.5px solid var(--brand)', zIndex: 1,
                  }} />

                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {m.title}
                    </p>
                    <p style={{ fontSize: '0.8125rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {m.event}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 03 · Principles ────────────────────────────────────────────────── */
function Principles() {
  const { principles = [] } = useAbout()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <SectionHeader
          num="03"
          label="Principles"
          title={[{ t: 'Four rules we have ' }, { t: 'never traded away', em: true }]}
          inView={inView}
          className="mb-12"
        />

        <div style={{ borderTop: '1px solid var(--divider)' }}>
          {principles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.6, ease: E }}
              className="grid md:grid-cols-[5rem_1fr] lg:grid-cols-[7rem_22rem_1fr] gap-x-6 gap-y-2"
              style={{ padding: '2rem 0', borderBottom: '1px solid var(--divider)' }}
            >
              <span className="tnum" style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', fontWeight: 500,
                color: 'var(--brand)', lineHeight: 1,
              }}>{p.n}</span>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', fontWeight: 500,
                letterSpacing: '-0.015em', color: 'var(--text-primary)', lineHeight: 1.25,
              }}>{p.title}</h3>

              <p style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: '60ch' }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 05 · Culture ───────────────────────────────────────────────────── */
function Culture() {
  const { culture = [], beliefs = [], founderNote } = useAbout()
  const team = useTeam()
  /* Signed by whoever actually holds the role in the roster — the note
     previously credited an "Alex Chen" who appeared nowhere else. */
  const founder = team.find(m => m.role?.includes('Founder')) ?? team[0]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section relative" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', overflow: 'hidden' }}>
      <ImagePlate src={img(TEXTURE.lattice, 1600, 1000)} />
      <div className="container relative" style={{ zIndex: 1 }}>
        <SectionHeader
          num="05"
          label="Culture"
          title={[{ t: 'What we do when ' }, { t: 'no one is watching', em: true }]}
          subtitle="Culture is not a perk list. It is the sum of the decisions nobody is around to see."
          inView={inView}
          className="mb-12"
        />

        {/* No boxes — the same borderless, hairline-divided treatment the
            impact stats use on the home page, so the two read as one idea
            rather than two ways of showing four numbers. */}
        <div className="stat-row mb-14">
          {culture.map(({ icon, value, label, desc }, i) => {
            const Icon = iconFor(icon)
            return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.6, ease: E }}
              className="stat-cell"
            >
              <span className="stat-badge">
                <Icon aria-hidden="true" />
              </span>

              <p className="stat-value tnum" style={{
                fontFamily: 'var(--font-display)', fontWeight: 500,
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', lineHeight: 1,
                letterSpacing: '-0.025em', color: 'var(--text-primary)',
              }}>{value}</p>
              <p className="stat-label eyebrow">{label}</p>
              <p className="stat-desc" style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
          {/* Founder's note — signed by the person who actually holds the role */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7, ease: E }}
            className="card flex flex-col justify-between"
            style={{ padding: '2rem', borderLeft: '2px solid var(--brand)' }}
          >
            <div>
              <p className="eyebrow mb-6">Founder's note</p>
              <blockquote className="pull-quote" style={{ marginBottom: '2rem' }}>
                {founderNote}
              </blockquote>
            </div>

            <Link to={`/team/${founder?.slug ?? ''}`} className="flex items-center gap-3.5">
              <img src={founder?.img} alt="" style={{
                width: 42, height: 42, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'top',
              }} />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {founder?.name}
                </p>
                <p className="eyebrow" style={{ fontSize: '0.625rem', marginTop: '0.15rem' }}>{founder?.role}</p>
              </div>
            </Link>
          </motion.div>

          {/* Beliefs */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: E }}
          >
            <p className="eyebrow mb-5">Things we actually believe</p>
            <div>
              {beliefs.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.45, ease: E }}
                  className="flex items-baseline gap-4"
                  style={{ padding: '0.875rem 0', borderBottom: i < beliefs.length - 1 ? '1px solid var(--divider)' : 'none' }}
                >
                  <span className="eyebrow shrink-0" style={{ width: '1.5rem', fontSize: '0.625rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{b}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── 06 · Close ─────────────────────────────────────────────────────── */
function Close() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: E }}
          className="text-center"
          style={{ maxWidth: '46rem', margin: '0 auto' }}
        >
          <p className="eyebrow mb-5">Next step</p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--step-4)', fontWeight: 500,
            lineHeight: 1.08, letterSpacing: '-0.025em', color: 'var(--text-primary)', textWrap: 'balance',
          }}>
            If that sounds like the studio you'd hire,
            {' '}<em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>let's talk</em>
          </h2>
          <p className="section-sub" style={{ margin: '1.25rem auto 0' }}>
            A short discovery call, an honest scope, and a milestone plan before anyone signs anything.
          </p>
          <div className="flex flex-wrap gap-3 justify-center" style={{ marginTop: '2rem' }}>
            <Link to="/contact" className="btn btn-primary micro-click">
              Start a project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/team" className="btn btn-secondary">Meet the team</Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <Opening />     {/* 01 */}
      <Story />       {/* 02 */}
      <Principles />  {/* 03 */}
      <Process num="04" />
      <Culture />     {/* 05 */}
      <Close />
    </>
  )
}
