import React from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Seo from '../components/Seo'
import { SITE, absUrl } from '../data/site'
import {
  ArrowLeft, ArrowRight, Clock, BarChart2, CalendarRange,
  Check, Wrench, Star, MapPin, Users,
} from 'lucide-react'
import { useCourse, useCourses, useMember, useTeam } from '../hooks/useSiteContent'
import { useAllContent } from '../context/ContentContext'
import { useContact } from '../context/ContactContext'
import EditorialImage, { ImagePlate } from '../components/ui/EditorialImage'
import { img, TEXTURE, courseImage } from '../data/imagery'
import { E, DUR, RISE } from '../lib/motion'
import { avatarFallback } from '../lib/avatar'

/**
 * The person who actually teaches the course.
 *
 * A named mentor with a face and a profile is the difference between a course
 * page and a brochure, so this sits above the sign-up button rather than in a
 * footnote. The whole card is one link through to their team profile.
 */
function MentorCard({ mentor }) {
  if (!mentor) return null

  return (
    <Link to={`/team/${mentor.slug}`} className="mentor-card card">
      <p className="eyebrow mb-4">Your mentor</p>

      <div className="flex items-center gap-4">
        <img
          src={mentor.img}
          alt={mentor.name}
          className="member-photo mentor-avatar"
          onError={avatarFallback(mentor.name, 200)}
        />
        <div className="min-w-0">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 500,
                      lineHeight: 1.25, color: 'var(--text-primary)' }}>
            {mentor.name}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.875rem',
                      color: 'var(--brand)', marginTop: '0.1rem' }}>
            {mentor.role}
          </p>
        </div>
      </div>

      <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-secondary)',
                  margin: '1rem 0 1.1rem' }}>
        {mentor.tagline}
      </p>

      <div className="mentor-meta">
        <span><MapPin aria-hidden="true" />{mentor.location}</span>
        {typeof mentor.stats?.rating === 'number' && (
          <span><Star aria-hidden="true" />{mentor.stats.rating.toFixed(1)}</span>
        )}
        <span><Users aria-hidden="true" />{mentor.years} yrs</span>
      </div>

      <span className="mentor-go">
        View full profile <ArrowRight aria-hidden="true" />
      </span>
    </Link>
  )
}

/**
 * One month of the plan. The three sit side by side rather than behind an
 * accordion, because the point of publishing the roadmap is that someone can
 * read all of it before paying.
 */
function MonthBlock({ m, i }) {
  return (
    <motion.div
      initial={{opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{delay: i * 0.1, duration: DUR.reveal, ease: E }}
      className="month-block"
    >
      <div className="month-head">
        <span className="month-num">{String(m.n).padStart(2, '0')}</span>
        <div>
          <p className="eyebrow">Month {m.n}</p>
          <h3 className="month-title">{m.title}</h3>
        </div>
      </div>

      <p className="month-focus">{m.focus}</p>

      <ul className="month-topics">
        {(m.topics ?? []).map(t => (
          <li key={t}><Check aria-hidden="true" /><span>{t}</span></li>
        ))}
      </ul>

      <div className="month-foot">
        <p><span className="eyebrow">You build</span>{m.project}</p>
        <p><span className="eyebrow">By the end</span>{m.youCan}</p>
      </div>
    </motion.div>
  )
}

export default function CourseDetailPage() {
  const { slug } = useParams()
  const course = useCourse(slug)
  const courses = useCourses()
  /* Every hook runs before the bail-out below, so the order stays stable
     whether or not the course was found. */
  const mentor = useMember(course?.mentor)
  const team = useTeam()
  const { status } = useAllContent()
  const { openContact } = useContact()

  /* A course added through the admin is not in the bundled catalogue, so an
     unknown slug is only unknown once the content request has settled. */
  if (!course) {
    if (status === 'loading') return <div style={{ minHeight: '70vh' }} aria-busy="true" />
    return <Navigate to="/404" replace />
  }

  const others = courses.filter(c => c.slug !== slug && c.field === course.field).slice(0, 3)

  return (
    <>
      {/* A named course, described as one. `Course` structured data is what
          puts a listing in Google's course results; `provider` is required
          for it and `hasCourseInstance` carries the shape of the thing. */}
      <Seo
        title={`${course.title} course`}
        description={course.blurb.slice(0, 155)}
        path={`/courses/${course.slug}`}
        jsonLd={{
          '@type': 'Course',
          name: course.title,
          description: course.blurb,
          url: absUrl(`/courses/${course.slug}`),
          educationalLevel: course.level,
          teaches: course.tools?.join(', '),
          provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: course.commitment,
          },
        }}
      />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="section pt-36 pb-0 relative"
        style={{ background: 'var(--bg-surface)', overflow: 'hidden' }}>
        <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} />

        <div className="container relative" style={{ zIndex: 1 }}>
          <Link to="/courses" className="tap inline-flex items-center gap-2 eyebrow mb-8"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> All courses
          </Link>

          <motion.div initial={{opacity: 0, y: RISE }} animate={{ opacity: 1, y: 0 }}
            transition={{duration: DUR.reveal, ease: E }}
            className="grid lg:grid-cols-[1.45fr_1fr] gap-10 xl:gap-16 items-start pb-16">

            <div>
              <p className="eyebrow mb-4">
                <span style={{ color: 'var(--brand)' }}>{course.field}</span>
                <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>
                {course.level}
              </p>

              <h1 className="section-title mb-5">{course.title}</h1>
              <p className="section-sub mb-8">{course.blurb}</p>

              <div className="fact-strip">
                <div>
                  <Clock aria-hidden="true" />
                  <span className="eyebrow">Length</span>
                  <strong>{course.duration}</strong>
                </div>
                <div>
                  <CalendarRange aria-hidden="true" />
                  <span className="eyebrow">Your time</span>
                  <strong>{course.commitment}</strong>
                </div>
                <div>
                  <BarChart2 aria-hidden="true" />
                  <span className="eyebrow">Starting from</span>
                  <strong>{course.level}</strong>
                </div>
              </div>
            </div>

            <MentorCard mentor={mentor} />
          </motion.div>

          <EditorialImage
            src={courseImage(course, 1600, 700)}
            alt=""
            ratio="21 / 9"
            parallax={7}
            eyebrow={course.field}
            caption={`${course.duration}, ${course.commitment.toLowerCase()}, starting from ${course.level.toLowerCase()}.`}
            className="pb-4"
          />
        </div>
      </section>

      {/* ── Who it is for, and the tools ───────────────────── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="grid lg:grid-cols-[1.45fr_1fr] gap-10 xl:gap-16 items-start">
            <div>
              <p className="eyebrow mb-3">Who this is for</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                          fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.015em',
                          color: 'var(--text-primary)', textWrap: 'balance' }}>
                {course.forWho}
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4 flex items-center gap-2">
                <Wrench style={{ width: 12, height: 12 }} /> What you will use
              </p>
              <div className="flex flex-wrap gap-2">
                {course.tools.map(t => (
                  <span key={t} className="chip" style={{ fontSize: '0.7rem' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The three month plan ───────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <p className="eyebrow mb-3">The plan</p>
          <h2 className="section-title mb-4">Three months, written down</h2>
          <p className="section-sub mb-12">
            Every month, what you cover, what you build, and what you will be able to do when
            it ends. You can read all of it before you decide.
          </p>

          <div className="month-grid">
            {(course.months ?? []).map((m, i) => <MonthBlock key={m.n} m={m} i={i} />)}
          </div>

          {/* Closing ask */}
          <div className="course-cta">
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 500,
                          color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Want to start with {mentor ? mentor.name.split(' ')[0] : 'us'}?
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                Tell us where you are starting from. We will say honestly whether this is the
                right course for you.
              </p>
            </div>
            <button onClick={openContact} className="btn btn-primary shrink-0">
              Ask about this course <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Related ────────────────────────────────────────── */}
      {others.length > 0 && (
        <section className="section" style={{ background: 'var(--bg)' }}>
          <div className="container">
            <p className="eyebrow mb-6">Others in {course.field}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map(c => {
                const m = team.find(p => p.slug === c.mentor)
                return (
                  <Link key={c.slug} to={`/courses/${c.slug}`} className="card"
                    style={{ padding: '1.35rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem',
                                 fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      {c.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--text-secondary)',
                                marginBottom: '1rem' }}>
                      {c.blurb}
                    </p>
                    {m && (
                      <p className="eyebrow" style={{ fontSize: '0.625rem' }}>
                        Taught by {m.name}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
