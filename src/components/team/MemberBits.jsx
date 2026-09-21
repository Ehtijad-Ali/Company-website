import React from 'react'
import { Star, Linkedin, Github, Twitter, Dribbble, Globe } from 'lucide-react'
import { AVAILABILITY } from '../../data/team'

const TONE = {
  positive: { dot: '#4F6B4A', text: 'var(--text-secondary)' },
  caution:  { dot: 'var(--terracotta-500)', text: 'var(--text-secondary)' },
  muted:    { dot: 'var(--text-disabled)', text: 'var(--text-muted)' },
}

export function AvailabilityBadge({ status, size = 'sm' }) {
  const meta = AVAILABILITY[status] ?? AVAILABILITY.limited
  const tone = TONE[meta.tone]
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: size === 'lg' ? '0.6875rem' : '0.625rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: tone.text,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: tone.dot,
        // Only the actively-available dot pulses; a static dot for the rest
        // keeps "fully booked" from reading as a live signal.
        animation: status === 'available' ? 'pulse-ring 2.4s ease-in-out infinite' : 'none',
      }} />
      {meta.label}
    </span>
  )
}

export function Rating({ value, count }) {
  /* A record saved without stats should lose the rating, not the page. */
  if (typeof value !== 'number') return null
  return (
    <span className="inline-flex items-center gap-1.5" title={`${value} out of 5 from ${count} projects`}>
      <Star className="w-3.5 h-3.5" style={{ color: 'var(--brand)', fill: 'var(--brand)' }} />
      <span className="tnum" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
        {value.toFixed(1)}
      </span>
      {count != null && (
        <span className="tnum" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ({count})
        </span>
      )}
    </span>
  )
}

/** Five segments; filled ones carry the brand colour. */
export function SkillLevel({ level }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          width: 14, height: 3, borderRadius: 2,
          background: i <= level ? 'var(--brand)' : 'var(--border)',
        }} />
      ))}
    </span>
  )
}

const ICONS = { linkedin: Linkedin, github: Github, twitter: Twitter, dribbble: Dribbble }

export function SocialLinks({ socials, dark = false }) {
  return (
    <div className="flex gap-2">
      {socials.map(({ id, url }) => {
        const Icon = ICONS[id] ?? Globe
        return (
          <a
            key={id} href={url} aria-label={id}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center hover-scale"
            style={{
              width: 30, height: 30, borderRadius: 'var(--r-sm)',
              background: dark ? 'rgba(255,255,255,0.08)' : 'var(--bg-surface)',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.14)' : 'var(--border)'}`,
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }} />
          </a>
        )
      })}
    </div>
  )
}
