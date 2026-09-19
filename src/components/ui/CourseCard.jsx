import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, BarChart2, ArrowUpRight } from 'lucide-react'
import { getMember } from '../../data/team'
import { E } from '../../lib/motion'
import { avatarFallback } from '../../lib/avatar'

/**
 * One course in a listing.
 *
 * Every card says the same things in the same order, because someone
 * choosing a course is comparing, and comparing is impossible when each
 * card is laid out differently.
 */
export default function CourseCard({ c, i = 0 }) {
  const mentor = getMember(c.mentor)

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (i % 3) * 0.06, duration: 0.5, ease: E }}
    >
      <Link to={`/courses/${c.slug}`} className="card flex flex-col h-full"
        style={{ padding: '1.5rem' }}>

        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="chip" style={{ fontSize: '0.65rem' }}>{c.field}</span>
          <ArrowUpRight style={{ width: 15, height: 15, color: 'var(--text-muted)' }} />
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 500,
                     lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {c.title}
        </h3>

        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)',
                    marginBottom: '1.25rem' }}>
          {c.blurb}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-5"
          style={{ borderTop: '1px solid var(--divider)' }}>
          <span className="flex items-center gap-1.5 eyebrow" style={{ fontSize: '0.625rem' }}>
            <Clock style={{ width: 12, height: 12 }} /> {c.duration}
          </span>
          <span className="flex items-center gap-1.5 eyebrow" style={{ fontSize: '0.625rem' }}>
            <BarChart2 style={{ width: 12, height: 12 }} /> {c.level}
          </span>
        </div>

        {/* Not a link of its own: this card is already one, and nesting
            anchors is invalid. The mentor is clickable on the course page. */}
        {mentor && (
          <div className="course-mentor">
            <img src={mentor.img} alt=""
              onError={avatarFallback(mentor.name, 120)} />
            <span>Taught by {mentor.name}</span>
          </div>
        )}
      </Link>
    </motion.div>
  )
}
