import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe2, FlaskConical, Zap, Heart } from 'lucide-react'
import Process from '../components/sections/Process'
import SectionHeader from '../components/ui/SectionHeader'
import EditorialImage, { ImagePlate } from '../components/ui/EditorialImage'
import { img, STUDIO, TEXTURE } from '../data/imagery'
import { METRICS, format, FOUNDED, TEAM_SIZE } from '../data/metrics'
import { TEAM } from '../data/team'
import { E } from '../lib/motion'


/* The founder's note is signed by whoever actually holds the role in the
   roster — it previously credited an "Alex Chen" who appears nowhere else. */
const FOUNDER = TEAM.find(m => m.role.includes('Founder')) ?? TEAM[0]

/**
 * Timeline for a studio founded in 2025 — roughly eighteen months of history,
 * so these are quarters rather than years. Keep it honest: a short list of
 * real decisions reads better than a padded decade.
 */
const MILESTONES = [
  { year: 'Q1 2025', title: 'Four people, one rule',
    event: 'Founded on a simple constraint: never take on more work than the founders can personally review.' },
  { year: 'Q2 2025', title: 'First platform build',
    event: 'A logistics client took a chance on a three-month-old studio. It shipped on time and they came back.' },
  { year: 'Q3 2025', title: 'Design and engineering merge',
    event: 'Stopped running them as separate practices. Every engagement since has had one team and no handoff.' },
  { year: 'Q4 2025', title: 'The first refusal',
    event: 'Turned down our largest enquiry to date because we could not staff it without hiring people we had not worked with.' },
  { year: 'Q1 2026', title: 'AI practice opens',
    event: 'First production ML systems shipped, for clients in fintech and logistics.' },
  { year: 'Q2 2026', title: 'Individually bookable',
    event: 'Opened the roster so clients can engage a single specialist by the hour, not just a whole project team.' },
]

const PRINCIPLES = [
  { n: '01', title: 'Craft over speed',
    desc: "We do not ship things we are not prepared to put our names on. When a deadline and the quality bar collide, we renegotiate the deadline, and we tell you early enough that it is still a choice." },
  { n: '02', title: 'Radical transparency',
    desc: 'You see the same board we do. Blockers surface the day they appear, not in a status call two weeks later. If we are behind, you will hear it from us first.' },
  { n: '03', title: 'Outcomes, not outputs',
    desc: 'We measure engagements by what changed in your business, not by tickets closed or hours logged. Occasionally that means arguing you out of the thing you asked for.' },
  { n: '04', title: 'Always learning',
    desc: 'A fifth of every quarter is protected for R&D and upskilling. It is the reason we can still recommend the boring, proven option with a straight face.' },
]

const CULTURE = [
  { icon: Globe2,       value: '100%',  label: 'Remote-first',      desc: 'A distributed team across six Pakistani cities, async-first, no mandatory 9-to-5.' },
  { icon: FlaskConical, value: '20%',   label: 'R&D every quarter', desc: 'Protected time each quarter for experimentation and learning.' },
  { icon: Zap,          value: '<48h',  label: 'Decision speed',    desc: 'Flat structure, no approval chains. The right person decides, fast.' },
  { icon: Heart,        value: '4.9/5', label: 'Team satisfaction', desc: 'Measured twice a year. We publish the result either way.' },
]

const BELIEFS = [
  'Great code is read far more often than it is written.',
  'Design without engineering constraints is decoration.',
  'The best feature is the one you choose not to build.',
  'Slow is smooth. Smooth is fast.',
  'Every bug is a process failure, not a person failure.',
  'Ship early, iterate publicly, improve relentlessly.',
]

/* ── 01 · Opening statement ─────────────────────────────────────────── */
function Opening() {
  const facts = [
    ['Founded', FOUNDED],
    ['Team', `${TEAM_SIZE} people`],
    ['Clients in', `${format('countries')} countries`],
    ['Projects', format('projects')],
  ]

  return (
    <section className="section pt-36" style={{ background: 'var(--bg-surface)', paddingBottom: '4rem' }}>
      <div className="container">
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
          {[
            [{ t: 'We stayed ' }, { t: 'small', em: true }],
            [{ t: 'on purpose.' }],
          ].map((line, i) => (
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
          Most studios grow until the people who won the work are no longer the
          people doing it. We decided not to, which is why there are still
          {' '}{TEAM_SIZE} of us, and why you will meet everyone who touches your project.
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
          caption="Small enough that everyone knows what everyone else shipped this week."
          className="mb-14"
        />

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-12 xl:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: E }}
            className="dropcap prose-measure"
          >
            <p>
              CodeNode began in 2025 with a frustration our founders kept running
              into from the client side: agencies that promised premium work and
              delivered something average, wrapped in an expensive presentation. The
              people in the pitch were rarely the people who showed up afterwards.
            </p>
            <p>
              They had spent their careers at companies where design and engineering
              sat in different buildings and shipped through a translation layer,
              and had watched what that costs in revisions, misunderstandings and
              quietly abandoned detail. So the studio was built with one team from
              the start. The person who draws it is the person who builds it.
            </p>

            <motion.blockquote
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="pull-quote"
              style={{ margin: '2.5rem 0' }}
            >
              Growth was never the goal. Being the studio we would have hired was.
            </motion.blockquote>

            <p>
              That constraint shapes everything downstream. We deliberately take on
              fewer engagements than we could fill, because every one is reviewed by
              someone senior end to end. We turn work down when we cannot staff it
              properly. And we say so early when a plan stops being the right one,
              which is not always the comfortable conversation.
            </p>
            <p>
              We are early, and we would rather say so than pretend otherwise. What
              has not moved since day one is the thing we are obsessive about: making
              things that genuinely work, and that hold up two years after launch.
            </p>

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
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: E }}
                  className="flex gap-5"
                  style={{ paddingBottom: i < MILESTONES.length - 1 ? '1.75rem' : 0 }}
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
          {PRINCIPLES.map((p, i) => (
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
          {CULTURE.map(({ icon: Icon, value, label, desc }, i) => (
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
          ))}
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
                We didn't set out to build the biggest studio. We set out to build the
                one we would have hired: obsessive about craft, honest about
                timelines, allergic to mediocrity.
              </blockquote>
            </div>

            <Link to={`/team/${FOUNDER.slug}`} className="flex items-center gap-3.5">
              <img src={FOUNDER.img} alt="" style={{
                width: 42, height: 42, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'top',
              }} />
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                  {FOUNDER.name}
                </p>
                <p className="eyebrow" style={{ fontSize: '0.625rem', marginTop: '0.15rem' }}>{FOUNDER.role}</p>
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
              {BELIEFS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.06, duration: 0.45, ease: E }}
                  className="flex items-baseline gap-4"
                  style={{ padding: '0.875rem 0', borderBottom: i < BELIEFS.length - 1 ? '1px solid var(--divider)' : 'none' }}
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
