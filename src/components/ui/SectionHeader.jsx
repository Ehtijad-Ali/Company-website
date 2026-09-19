import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { E } from '../../lib/motion'


const emStyle = { fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }

/**
 * The heading, set word by word.
 *
 * Each word sits in its own overflow mask and rises out of it a beat after
 * the one before, which is the difference between a heading that appears
 * and a heading that arrives. Words, not letters: letter-by-letter reads as
 * a gimmick in a serif this size, and words survive wrapping at any width.
 *
 * Anyone who has asked for reduced motion gets the same heading, still.
 */
function TitleWords({ parts, inView }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return parts.map((p, i) =>
      p.em ? <em key={i} style={emStyle}>{p.t}</em> : <span key={i}>{p.t}</span>
    )
  }

  let n = 0
  return parts.flatMap((p, pi) =>
    /* Keep the separators: they are rendered as plain text so the line
       still wraps and collapses whitespace the way a heading should. */
    p.t.split(/(\s+)/).filter(Boolean).map((chunk, ci) => {
      const key = `${pi}-${ci}`
      if (/^\s+$/.test(chunk)) return <span key={key}> </span>
      const delay = 0.05 + n++ * 0.035
      return (
        <span key={key} className="sh-word">
          <motion.span
            style={p.em ? emStyle : undefined}
            initial={{ y: '115%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ delay, duration: 0.75, ease: E }}
          >
            {chunk}
          </motion.span>
        </span>
      )
    })
  )
}

/**
 * The one section header used across the site.
 *
 * Replaces the per-section copies that each rebuilt an eyebrow, a heading and
 * a giant outline-stroke number — five near-identical implementations that
 * drifted apart. Outline-stroke display type is deliberately gone: it reads as
 * a template at the best of times, and badly in a high-contrast serif.
 *
 * `title` takes a string, or an array of parts where `{ em: true }` marks the
 * one phrase set in italic brand colour:
 *   title={[{ t: 'Numbers that ' }, { t: 'move', em: true }, { t: ' the needle' }]}
 */
export default function SectionHeader({
  num,
  label,
  title,
  subtitle,
  action,       // { to, label }
  // 'split' puts the action opposite the heading; 'stack' drops it below;
  // 'center' centres the whole block and sits the action underneath.
  align = 'split',
  as: Tag = 'h2',   // page-top headings pass as="h1" so each page has exactly one
  inView = true,
  className = '',
}) {
  const parts = Array.isArray(title) ? title : [{ t: title }]
  const centred = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: E }}
      className={`${centred
        ? 'flex flex-col items-center text-center gap-y-6'
        : 'flex flex-wrap items-end justify-between gap-x-8 gap-y-5'} ${className}`}
    >
      {/* `section-sub` carries its own 60ch measure, so centring the block
          means centring that measure too, not just the text inside it. */}
      <div style={{ maxWidth: '46rem' }} className={centred ? 'mx-auto [&>.section-sub]:mx-auto' : undefined}>
        {(num || label) && (
          <p className="eyebrow mb-3">
            {num && <span style={{ color: 'var(--brand)' }}>{num}</span>}
            {num && label && <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>}
            {label}
          </p>
        )}

        <Tag className="section-title">
          <TitleWords parts={parts} inView={inView} />
        </Tag>

        {subtitle && <p className="section-sub mt-4">{subtitle}</p>}
      </div>

      {action && (align === 'split' || centred) && (
        <Link to={action.to}
          className={`tap shrink-0 flex items-center gap-2 text-sm${centred ? '' : ' mb-1'}`}
          style={{ color: 'var(--text-secondary)' }}>
          {action.label}
          <span style={{
            width: 30, height: 30, borderRadius: 'var(--r-sm)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)', background: 'var(--bg-card)',
          }}>
            <ArrowUpRight style={{ width: 13, height: 13 }} />
          </span>
        </Link>
      )}
    </motion.div>
  )
}
