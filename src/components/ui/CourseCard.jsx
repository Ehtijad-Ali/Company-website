import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, BarChart2, ArrowUpRight } from 'lucide-react'
import { useMember } from '../../hooks/useSiteContent'
import { courseImage } from '../../data/imagery'
import { E, DUR, RISE } from '../../lib/motion'
import { avatarFallback } from '../../lib/avatar'

/**
 * One course in a listing.
 *
 * Every card says the same things in the same order, because someone
 * choosing a course is comparing, and comparing is impossible when each
 * card is laid out differently.
 *
 * The image is not decoration: twelve text cards in a grid read as a list
 * of headings, and a catalogue that looks like a table of contents does
 * not look like something you pay for.
 */
export default function CourseCard({ c, i = 0 }) {
  const mentor = useMember(c.mentor)

  return (
    <motion.div
      initial={{opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{delay: (i % 3) * 0.06, duration: DUR.reveal, ease: E }}
      className="course-card"
    >
      <Link to={`/courses/${c.slug}`} className="course-card__link">

        <div className="course-card__media">
          <img
            src={courseImage(c, 720, 460)}
            alt=""
            loading="lazy"
            decoding="async"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <span className="chip course-card__field">{c.field}</span>
          <span className="course-card__go"><ArrowUpRight aria-hidden="true" /></span>
        </div>

        <div className="course-card__body">
          <h3 className="course-card__title">{c.title}</h3>
          <p className="course-card__blurb">{c.blurb}</p>

          <div className="course-card__meta">
            <span><Clock aria-hidden="true" /> {c.duration}</span>
            <span><BarChart2 aria-hidden="true" /> {c.level}</span>
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
        </div>
      </Link>
    </motion.div>
  )
}
