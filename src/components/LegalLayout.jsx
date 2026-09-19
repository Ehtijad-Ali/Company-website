import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronDown, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { E } from '../lib/motion'


function SectionBlock({ section, i, onInView }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-35% 0px -55% 0px' })

  useEffect(() => { if (inView) onInView(section.id) }, [inView, section.id, onInView])

  return (
    <motion.section
      ref={ref}
      id={section.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: Math.min(i, 4) * 0.04, duration: 0.55, ease: E }}
      style={{
        marginBottom: 'clamp(2rem, 5vw, 3rem)',
        paddingBottom: 'clamp(2rem, 5vw, 3rem)',
        borderBottom: '1px solid var(--divider)',
        // Clears the fixed navbar when jumping via the table of contents
        scrollMarginTop: '6.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '1.125rem' }}>
        <span className="tnum" style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', letterSpacing: '0.08em',
          color: 'var(--brand)', paddingTop: '0.4rem', flexShrink: 0,
        }}>{String(i + 1).padStart(2, '0')}</span>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 500,
          fontSize: 'clamp(1.15rem, 2.6vw, 1.4rem)', letterSpacing: '-0.015em',
          color: 'var(--text-primary)', margin: 0, lineHeight: 1.3,
        }}>{section.title}</h2>
      </div>

      {/* Indent only where there's room for it */}
      <div className="legal-body">
        {section.content.map((block, bi) => {
          if (block.type === 'p') return (
            <p key={bi} style={{ fontSize: '0.9375rem', lineHeight: 1.85, color: 'var(--text-secondary)', marginBottom: '0.9rem', textWrap: 'pretty' }}>
              {block.text}
            </p>
          )
          if (block.type === 'list') return (
            <ul key={bi} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', listStyle: 'none', padding: 0 }}>
              {block.items.map((item, ii) => (
                <li key={ii} style={{ display: 'flex', gap: '0.7rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <span aria-hidden="true" style={{
                    width: 5, height: 5, borderRadius: '50%', background: 'var(--brand)',
                    marginTop: '0.6rem', flexShrink: 0,
                  }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
          if (block.type === 'highlight') return (
            <div key={bi} style={{
              padding: '1rem 1.125rem', borderRadius: 'var(--r-md)', marginBottom: '1rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderLeft: '2px solid var(--brand)',
            }}>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>{block.text}</p>
            </div>
          )
          return null
        })}
      </div>
    </motion.section>
  )
}

export default function LegalLayout({ badge, title, tagline, updated, number, sections }) {
  const [active, setActive] = useState(sections[0].id)
  const [tocOpen, setTocOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  /* Stable identity so SectionBlock's effect doesn't re-fire every render. */
  const handleInView = useCallback(id => setActive(id), [])

  /* Reading progress — long legal documents benefit from knowing how far in
     you are, and it doubles as the mobile TOC's affordance. */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(id)
    setTocOpen(false)
  }

  const activeIndex = sections.findIndex(s => s.id === active)

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh', paddingBottom: 'clamp(3rem, 8vw, 6rem)' }}>

      {/* Hero */}
      <div style={{
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        paddingTop: 'clamp(6rem, 14vw, 7rem)', paddingBottom: 'clamp(2.5rem, 7vw, 4rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 88% 30%, var(--accent-glow), transparent 70%)',
        }} />

        <div className="container relative z-10">
          <Link to="/" className="tap inline-flex items-center gap-2 eyebrow mb-7"
            style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft style={{ width: '0.8rem', height: '0.8rem' }} /> Back to home
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
            <span className="chip">{badge}</span>
            <span className="eyebrow">Last updated {updated}</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'var(--step-5)', letterSpacing: '-0.028em',
            color: 'var(--text-primary)', lineHeight: 1.06, marginBottom: '1rem',
          }}>{title}</h1>

          <p className="section-sub" style={{ maxWidth: '52ch' }}>{tagline}</p>
        </div>
      </div>

      {/* Mobile contents — the sidebar is desktop-only, so without this a
          phone user has no way to navigate a long document. */}
      <div className="lg:hidden" style={{
        position: 'sticky', top: '4.75rem', zIndex: 30,
        background: 'rgba(var(--bg-card-rgb), 0.92)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ height: 2, background: 'var(--divider)' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--brand)', transition: 'width 0.1s linear' }} />
        </div>

        <button
          onClick={() => setTocOpen(o => !o)}
          aria-expanded={tocOpen}
          className="container flex items-center justify-between w-full"
          style={{ padding: '0.75rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span className="eyebrow shrink-0" style={{ color: 'var(--brand)' }}>
              {String(Math.max(0, activeIndex) + 1).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 500,
              color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {sections[Math.max(0, activeIndex)]?.title}
            </span>
          </span>
          <ChevronDown className="w-4 h-4 shrink-0" style={{
            color: 'var(--text-muted)',
            transform: tocOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.25s var(--ease)',
          }} />
        </button>

        <AnimatePresence>
          {tocOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: E }}
              style={{ overflow: 'hidden', listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--divider)' }}
            >
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button onClick={() => scrollTo(s.id)} className="container flex items-center gap-3 w-full text-left"
                    style={{
                      padding: '0.7rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer',
                      color: active === s.id ? 'var(--brand)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                    }}>
                    <span className="eyebrow shrink-0" style={{ fontSize: '0.625rem' }}>{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="container" style={{ paddingTop: 'clamp(2rem, 6vw, 4rem)' }}>
        <div className="legal-grid">

          <aside className="hidden lg:block" style={{ position: 'sticky', top: '6.5rem', alignSelf: 'start' }}>
            <p className="eyebrow mb-4">Contents</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button onClick={() => scrollTo(s.id)} style={{
                    display: 'flex', alignItems: 'baseline', gap: '0.6rem', width: '100%', textAlign: 'left',
                    padding: '0.45rem 0.7rem', borderRadius: 'var(--r-sm)',
                    fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.4,
                    fontWeight: active === s.id ? 500 : 400,
                    color: active === s.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    background: active === s.id ? 'var(--bg-card)' : 'transparent',
                    border: `1px solid ${active === s.id ? 'var(--border)' : 'transparent'}`,
                    cursor: 'pointer', transition: 'color 0.2s ease, background 0.2s ease',
                  }}>
                    <span className="tnum shrink-0" style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
                      color: active === s.id ? 'var(--brand)' : 'var(--text-disabled)',
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div style={{ minWidth: 0 }}>
            {sections.map((s, i) => (
              <SectionBlock key={s.id} section={s} i={i} onInView={handleInView} />
            ))}

            <div className="card flex items-start gap-4" style={{ marginTop: '1.5rem', padding: '1.25rem 1.375rem' }}>
              <span className="flex items-center justify-center shrink-0" style={{
                width: 34, height: 34, borderRadius: 'var(--r-sm)',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
              }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--brand)' }} />
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Questions about this policy?
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  Reach us at{' '}
                  <a href="mailto:legal@codenode.io" className="tap" style={{ color: 'var(--brand)', textDecoration: 'underline', textUnderlineOffset: '3px', wordBreak: 'break-word' }}>
                    legal@codenode.io
                  </a>{' '}
                  and we aim to respond within two business days.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
