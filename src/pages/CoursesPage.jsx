import React, { useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import CourseCard from '../components/ui/CourseCard'
import CourseAdvisor from '../components/courses/CourseAdvisor'
import EditorialImage, { ImagePlate } from '../components/ui/EditorialImage'
import { img, STUDIO, TEXTURE } from '../data/imagery'
import { useContact } from '../context/ContactContext'
import { useContent } from '../context/ContentContext'
import { useCourses, useCourseFields, useTeam } from '../hooks/useSiteContent'
import { iconFor } from '../lib/icons'
import { E } from '../lib/motion'
import { avatarFallback } from '../lib/avatar'

/**
 * The courses page.
 *
 * The catalogue used to be section 04 of the services page, which made the
 * teaching side a footnote to the consultancy — and every "Courses" link in
 * the navigation, the footer and the sitemap pointed at an anchor halfway
 * down a page about hiring us.
 *
 * The order is the order someone nervous about three months of their life
 * needs it in: what this is → how it runs → help choosing → the full list →
 * who teaches it → the ask.
 *
 * Everything except the catalogue and the mentors comes from the
 * `coursesPage` content document; those two are the live courses and team.
 */

/* ── 01 · Opening ────────────────────────────────────────────────────── */
function Opening({ page, count }) {
  const facts = (page.facts ?? []).map(f => ({
    ...f,
    value: String(f.value ?? '').replace('{count}', count),
  }))

  return (
    <section className="section pt-36 pb-0 relative" style={{ background: 'var(--bg)', overflow: 'hidden' }}>
      {/* The Contact hero's ground, so every page opens in the same room. */}
      <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} />

      <div className="container relative" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: E }}
        >
          <p className="eyebrow mb-4">
            <span style={{ color: 'var(--brand)' }}>01</span>
            <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>{page.eyebrow}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--step-5)', fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-0.028em', color: 'var(--text-primary)',
            maxWidth: '20ch', textWrap: 'balance',
          }}>
            {(page.title ?? []).map((p, i) => p.em
              ? <em key={i} style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>{p.t}</em>
              : <span key={i}>{p.t}</span>)}
          </h1>

          <p className="section-sub mt-5" style={{ maxWidth: '56ch' }}>{page.subtitle}</p>

          <div className="fact-strip" style={{ marginTop: '2.5rem' }}>
            {facts.map(f => (
              <div key={f.label}>
                <span className="eyebrow">{f.label}</span>
                <strong>{f.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The room the teaching actually happens in, at the width that
            makes this read as a place rather than a product page. */}
        <EditorialImage
          src={img(STUDIO.homeStudio, 1600, 700)}
          alt="A mentor and a student working through a plan"
          ratio="21 / 9"
          parallax={7}
          eyebrow="Small groups"
          caption="Every course is taught by someone who bills for this skill during the week."
          className="mt-14"
        />
      </div>
    </section>
  )
}

/* ── 02 · How it runs ────────────────────────────────────────────────── */
function Steps({ page }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHeader
          num="02"
          label="How it runs"
          title={[{ t: 'Three months, ' }, { t: 'no surprises', em: true }]}
          inView={inView}
          className="mb-12"
        />

        <div className="course-steps">
          {(page.steps ?? []).map((s, i) => {
            const Icon = iconFor(s.icon)
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: E }}
                className="course-step"
              >
                <span className="course-step__icon"><Icon aria-hidden="true" /></span>
                <span className="course-step__n">{s.n}</span>
                <h3 className="course-step__title">{s.title}</h3>
                <p className="course-step__text">{s.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── 03 · The catalogue ──────────────────────────────────────────────── */
function Catalogue({ courses, fields }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [field, setField] = useState('All')

  const shown = field === 'All' ? courses : courses.filter(c => c.field === field)
  const countFor = f => (f === 'All' ? courses.length : courses.filter(c => c.field === f).length)

  return (
    <section id="catalogue" ref={ref} className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <SectionHeader
          num="03"
          label="Catalogue"
          title={[{ t: 'Or browse ' }, { t: 'all of them', em: true }]}
          subtitle="Every course, with the level it starts at, the hours it asks for and the person who teaches it."
          inView={inView}
          className="mb-10"
        />

        <div className="course-filter">
          {fields.map(f => (
            <button key={f} onClick={() => setField(f)}
              className={`course-filter__btn${field === f ? ' is-on' : ''}`}
              aria-pressed={field === f}>
              {f} <span className="course-filter__count">{countFor(f)}</span>
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((c, i) => <CourseCard key={c.slug} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── 04 · Who teaches ────────────────────────────────────────────────── */
function Mentors({ page, courses, team }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  /* Only the people who actually mentor something, each with the courses
     they teach — derived, so it cannot drift from the catalogue. */
  const mentors = useMemo(() => {
    const bySlug = new Map()
    for (const c of courses) {
      if (!c.mentor) continue
      if (!bySlug.has(c.mentor)) bySlug.set(c.mentor, [])
      bySlug.get(c.mentor).push(c)
    }
    return [...bySlug.entries()]
      .map(([slug, list]) => ({ member: team.find(m => m.slug === slug), courses: list }))
      .filter(m => m.member)
  }, [courses, team])

  if (mentors.length === 0) return null

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHeader
          num="04"
          label="Mentors"
          title={page.mentorsTitle ?? [{ t: 'Taught by the people who ' }, { t: 'do the work', em: true }]}
          subtitle={page.mentorsNote}
          inView={inView}
          className="mb-12"
        />

        <div className="mentor-grid">
          {mentors.map(({ member, courses: taught }, i) => (
            <motion.div
              key={member.slug}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: (i % 4) * 0.07, duration: 0.5, ease: E }}
            >
              <Link to={`/team/${member.slug}`} className="mentor-tile">
                <img src={member.img} alt={member.name}
                  onError={avatarFallback(member.name, 160)} />
                <div>
                  <p className="mentor-tile__name">{member.name}</p>
                  <p className="mentor-tile__role">{member.role}</p>
                  <p className="mentor-tile__teaches">
                    {taught.map(c => c.title).join(' · ')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 05 · The ask ────────────────────────────────────────────────────── */
function Ask({ page, onTalk }) {
  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div className="course-ask">
          <div>
            <h2 className="course-ask__title">{page.ctaTitle}</h2>
            <p className="course-ask__text">{page.ctaText}</p>
          </div>
          <div className="course-ask__actions">
            <button onClick={onTalk} className="btn btn-primary micro-click">
              {page.ctaLabel ?? 'Ask us directly'} <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/services" className="btn btn-secondary micro-click">
              Hire the team instead
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function CoursesPage() {
  const { openContact } = useContact()
  const page = useContent('coursesPage')
  const courses = useCourses()
  const fields = useCourseFields()
  const team = useTeam()

  return (
    <>
      <Opening page={page} count={courses.length} />
      <Steps page={page} />

      <section className="section" style={{ background: 'var(--bg)', paddingTop: 0 }}>
        <div className="container">
          <CourseAdvisor onTalk={openContact} />
        </div>
      </section>
      <Catalogue courses={courses} fields={fields} />
      <Mentors page={page} courses={courses} team={team} />
      <Ask page={page} onTalk={openContact} />
    </>
  )
}
