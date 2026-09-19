import React, { useEffect, useRef, useState, useCallback } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

/* ─────────────────────────────────────────────────────────────
   ScrollReveal  — wraps any children with scroll-triggered reveal
   Props: variant ('fade'|'left'|'right'|'scale'|''), delay (0-4), as, className
   ───────────────────────────────────────────────────────────── */
export function ScrollReveal({ children, variant = '', delay = 0, as: Tag = 'div', className = '', style }) {
  const ref = useScrollReveal({ variant, delay })
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}

/* ─────────────────────────────────────────────────────────────
   ParallaxSection  — CSS-transform parallax on scroll
   Props: speed (0.1–0.5), children, className, style
   ───────────────────────────────────────────────────────────── */
export function ParallaxSection({ children, speed = 0.2, className = '', style }) {
  const ref = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const viewportCenter = window.innerHeight / 2
        const offset = (centerY - viewportCenter) * speed
        el.style.transform = `translateY(${offset.toFixed(2)}px)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [speed])

  return (
    <div ref={ref} className={`parallax-wrap ${className}`} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   GradientBackground  — animated gradient bg layer
   Renders a fixed or absolute decorative layer
   ───────────────────────────────────────────────────────────── */
export function GradientBackground({ className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={`gradient-bg-anim ${className}`}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', zIndex: 0,
        ...style,
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   TypingText  — cycles through words with a typing effect
   Props: words[], speed (ms/char), pauseMs, className
   ───────────────────────────────────────────────────────────── */
export function TypingText({ words, speed = 75, pauseMs = 1800, className = '', style }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!words?.length) return

    const current = words[wordIdx]

    if (!deleting && charIdx <= current.length) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx))
        setCharIdx(c => c + 1)
      }, charIdx === 0 ? pauseMs / 3 : speed)
      return () => clearTimeout(t)
    }

    if (!deleting && charIdx > current.length) {
      const t = setTimeout(() => setDeleting(true), pauseMs)
      return () => clearTimeout(t)
    }

    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx))
        setCharIdx(c => c - 1)
      }, speed / 2)
      return () => clearTimeout(t)
    }

    if (deleting && charIdx < 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
      setCharIdx(0)
    }
  }, [charIdx, deleting, wordIdx, words, speed, pauseMs])

  return (
    <span className={className} style={style}>
      {display}
      <span className="typing-cursor" aria-hidden="true" />
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   SkeletonLoader  — shimmer placeholders
   Preset shapes: 'card' | 'list' | 'profile' | custom children
   ───────────────────────────────────────────────────────────── */
export function SkeletonLoader({ preset = 'card', count = 1, className = '' }) {
  const cards = Array.from({ length: count })

  if (preset === 'list') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        {cards.map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4" style={{ border: '1px solid var(--border)', borderRadius: 14 }}>
            <div className="skeleton skeleton-circle shrink-0" style={{ width: 44, height: 44 }} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skeleton skeleton-text" style={{ width: '55%' }} />
              <div className="skeleton skeleton-text" style={{ width: '80%', height: '0.75em' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (preset === 'profile') {
    return (
      <div className={`flex flex-col items-center gap-4 p-6 ${className}`}>
        <div className="skeleton skeleton-circle" style={{ width: 80, height: 80 }} />
        <div className="skeleton skeleton-text" style={{ width: 120 }} />
        <div className="skeleton skeleton-text" style={{ width: 80, height: '0.65em' }} />
      </div>
    )
  }

  return (
    <div className={`grid gap-6 ${count > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} ${className}`}>
      {cards.map((_, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
          <div className="skeleton skeleton-img" />
          <div className="p-5 flex flex-col gap-3">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '70%' }} />
            <div className="skeleton skeleton-btn mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SpinnerLoader  — SVG stroke spinner
   Props: size ('sm'|''|'lg'), className, label
   ───────────────────────────────────────────────────────────── */
export function SpinnerLoader({ size = '', className = '', label = 'Loading…' }) {
  const cls = size ? `spinner spinner-${size}` : 'spinner'
  return (
    <svg
      className={`${cls} ${className}`}
      viewBox="0 0 50 50"
      aria-label={label}
      role="status"
    >
      <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   PageTransition  — wraps page content with scaleIn animation
   ───────────────────────────────────────────────────────────── */
export function PageTransition({ children, className = '' }) {
  return (
    <div className={`page-enter ${className}`}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   HoverCard  — card with lift + glow on hover
   ───────────────────────────────────────────────────────────── */
export function HoverCard({ children, className = '', style }) {
  return (
    <div className={`card hover-lift ${className}`} style={style}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   ImageZoom  — image container with zoom-on-hover
   ───────────────────────────────────────────────────────────── */
export function ImageZoom({ src, alt, className = '', style }) {
  return (
    <div className="img-zoom-wrap" style={{ borderRadius: 'inherit', ...style }}>
      <img src={src} alt={alt} className={`img-zoom w-full h-full object-cover ${className}`} />
    </div>
  )
}
