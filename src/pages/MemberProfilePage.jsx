import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Seo from '../components/Seo'
import { SITE, absUrl } from '../data/site'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Briefcase, CalendarCheck, ArrowUpRight, Award, Languages } from 'lucide-react'
import { formatRate } from '../data/team'
import { useMember, useRelatedMembers } from '../hooks/useSiteContent'
import { useAllContent } from '../context/ContentContext'
import { AvailabilityBadge, Rating, SkillLevel, SocialLinks } from '../components/team/MemberBits'
import InterviewModal from '../components/InterviewModal'
import { E } from '../lib/motion'
import { avatarFallback } from '../lib/avatar'

function SectionHeading({ children, num }) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span className="eyebrow" style={{ color: 'var(--brand)' }}>{num}</span>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)',
        fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text-primary)',
      }}>{children}</h2>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="tnum" style={{
        fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)',
        fontWeight: 500, lineHeight: 1.1, color: 'var(--text-primary)',
      }}>{value}</p>
      <p className="eyebrow" style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>{label}</p>
    </div>
  )
}

export default function MemberProfilePage() {
  const { slug } = useParams()
  const member = useMember(slug)
  /* Both hooks run on every render, including the ones where the member is
     not found — bailing out before them would change the hook order. */
  const related = useRelatedMembers(slug)
  const { status } = useAllContent()
  const [hiring, setHiring] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [slug])

  /* Someone added through the admin is not in the bundled roster, so an
     unknown slug is only really unknown once the content request has
     settled. Redirecting before then would bounce a valid profile. */
  if (!member) {
    if (status === 'loading') return <div style={{ minHeight: '70vh' }} aria-busy="true" />
    // Unknown slug: send them to the roster rather than a dead end.
    return <Navigate to="/team" replace />
  }

  const bookable = member.availability !== 'booked'

  return (
    <>
      {/* A named person, described as one: the route table only knows
          this is "a team member". */}
      <Seo
        title={`${member.name} — ${member.role}`}
        description={member.bio.slice(0, 155)}
        path={`/team/${member.slug}`}
        image={member.img}
        type="profile"
        jsonLd={{
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role,
          description: member.bio,
          image: member.img,
          url: absUrl(`/team/${member.slug}`),
          worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        }}
      />
      <section className="section pt-36" style={{ background: 'var(--bg-surface)', paddingBottom: '3rem' }}>
        <div className="container">
          <Link to="/team" className="inline-flex items-center gap-2 mb-8 eyebrow"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft className="w-3.5 h-3.5" /> All team
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: E }}
            className="grid lg:grid-cols-[200px_1fr] gap-8 items-start"
          >
            <img
              src={member.img} alt={member.name}
              className="w-full member-photo"
              style={{
                aspectRatio: '1', objectFit: 'cover', objectPosition: 'top',
                borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
                maxWidth: 200, boxShadow: 'var(--e-2)',
              }}
              onError={avatarFallback(member.name, 400)}
            />

            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                <span className="chip">{member.dept}</span>
                <AvailabilityBadge status={member.availability} size="lg" />
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-5)',
                fontWeight: 500, lineHeight: 1.05, letterSpacing: '-0.028em',
                color: 'var(--text-primary)', marginBottom: '0.35rem',
              }}>{member.name}</h1>

              <p style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 'var(--step-1)', color: 'var(--brand)', marginBottom: '1rem',
              }}>{member.role}</p>

              <p className="section-sub" style={{ marginBottom: '1.5rem' }}>{member.tagline}</p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> {member.location}
                </span>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> {member.timezone}
                </span>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <Briefcase className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /> {member.years} yrs experience
                </span>
                <Rating value={member.stats?.rating} count={member.stats?.projects} />
                <SocialLinks socials={member.socials} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)', paddingTop: '3.5rem' }}>
        <div className="container grid lg:grid-cols-[1fr_320px] gap-12 items-start">

          {/* ── Main column ── */}
          <div className="flex flex-col gap-14">

            <div>
              <SectionHeading num="01">About</SectionHeading>
              <p className="section-sub" style={{ maxWidth: '68ch' }}>{member.bio}</p>
            </div>

            <div>
              <SectionHeading num="02">Skills</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
                {(member.skills ?? []).map(s => (
                  <div key={s.name} className="flex items-center justify-between gap-4"
                    style={{ paddingBottom: '0.625rem', borderBottom: '1px solid var(--divider)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{s.name}</span>
                    <SkillLevel level={s.level} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading num="03">Selected work</SectionHeading>
              <div className="flex flex-col gap-3">
                {(member.portfolio ?? []).map(p => (
                  <div key={p.title} className="card" style={{ padding: '1.25rem 1.375rem' }}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h3 style={{
                        fontFamily: 'var(--font-display)', fontSize: '1.0625rem',
                        fontWeight: 500, color: 'var(--text-primary)',
                      }}>{p.title}</h3>
                      <span className="chip">{p.type}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      {p.blurb}
                    </p>
                    <p className="eyebrow" style={{ color: 'var(--brand)', letterSpacing: '0.1em' }}>{p.metric}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                  <h3 className="eyebrow" style={{ color: 'var(--text-primary)' }}>Credentials</h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {(member.credentials ?? []).map(c => (
                    <li key={c} className="flex items-start gap-2.5" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--brand)', marginTop: 8, flexShrink: 0 }} />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                  <h3 className="eyebrow" style={{ color: 'var(--text-primary)' }}>Languages</h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {(member.languages ?? []).map(l => (
                    <li key={l.name} className="flex items-center justify-between gap-4"
                      style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <span>{l.name}</span>
                      <span className="eyebrow" style={{ fontSize: '0.625rem' }}>{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Hire card — sticky on desktop ── */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: E }}
            className="card"
            style={{ padding: '1.5rem', position: 'sticky', top: '6.5rem' }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="tnum" style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-4)',
                fontWeight: 500, lineHeight: 1, color: 'var(--text-primary)',
              }}>{formatRate(member.rate)}</span>
              <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>/ hour</span>
            </div>
            <p className="eyebrow" style={{ marginTop: '0.4rem' }}>{member.minEngagement}</p>

            <hr className="rule" style={{ margin: '1.25rem 0' }} />

            <div className="flex flex-col gap-3" style={{ fontSize: '0.8125rem' }}>
              <div className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>Availability</span>
                <AvailabilityBadge status={member.availability} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>Capacity</span>
                <span className="tnum" style={{ color: 'var(--text-primary)' }}>
                  {member.hoursPerWeek > 0 ? `${member.hoursPerWeek} hrs / week` : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--text-muted)' }}>Replies</span>
                <span style={{ color: 'var(--text-primary)' }}>{member.stats?.responseTime}</span>
              </div>
            </div>

            <hr className="rule" style={{ margin: '1.25rem 0' }} />

            <div className="grid grid-cols-3 gap-3 mb-5">
              <Stat label="Projects" value={member.stats?.projects ?? '—'} />
              <Stat label="Rating"   value={typeof member.stats?.rating === 'number' ? member.stats.rating.toFixed(1) : '—'} />
              <Stat label="On time"  value={member.stats?.onTime != null ? `${member.stats.onTime}%` : '—'} />
            </div>

            <button
              onClick={() => setHiring(true)}
              className="btn btn-primary micro-click w-full"
              style={{ justifyContent: 'center' }}
            >
              <CalendarCheck className="w-4 h-4" />
              {bookable ? 'Request an interview' : 'Join the waitlist'}
            </button>

            <p style={{ fontSize: '0.75rem', lineHeight: 1.55, color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              {bookable
                ? "We'll confirm availability before anything is booked."
                : `${member.name.split(' ')[0]} is fully booked. We'll tell you when capacity opens.`}
            </p>
          </motion.aside>
        </div>
      </section>

      {/* ── Related members ── */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <SectionHeading num="04">Others you might work with</SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.slug} to={`/team/${r.slug}`} className="card flex items-center gap-4"
                  style={{ padding: '1rem' }}>
                  <img src={r.img} alt="" className="member-photo" style={{
                    width: 52, height: 52, borderRadius: 'var(--r-sm)',
                    objectFit: 'cover', objectPosition: 'top', flexShrink: 0,
                  }} />
                  <div className="min-w-0 flex-1">
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {r.name}
                    </p>
                    <p className="eyebrow" style={{ fontSize: '0.625rem', marginTop: 2 }}>{r.role}</p>
                    <p className="tnum" style={{ fontSize: '0.8125rem', color: 'var(--brand)', marginTop: 4 }}>
                      {formatRate(r.rate)}/hr
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <InterviewModal member={member} open={hiring} onClose={() => setHiring(false)} />
    </>
  )
}
