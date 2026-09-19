import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, Home, Info, Briefcase, FolderOpen, GraduationCap, Users, BookOpen, Shield, FileText, Cookie, Map } from 'lucide-react'

const SITEMAP = [
  {
    section: 'Main',
    color: 'var(--accent)',
    pages: [
      { icon: Home,       label: 'Home',       path: '/',          desc: 'Agency overview, hero, services snapshot, portfolio highlights, and team intro.' },
      { icon: Info,       label: 'About',      path: '/about',     desc: 'Our origin story, mission, values, and what drives us to build exceptional products.' },
      { icon: Users,      label: 'Team',       path: '/team',      desc: 'Meet the engineers, designers, and strategists behind every engagement.' },
    ],
  },
  {
    section: 'Work',
    color: 'var(--accent)',
    pages: [
      { icon: Briefcase,  label: 'Services',   path: '/services',  desc: 'The full scope of what we offer, from web development to AI/ML to cybersecurity.' },
      { icon: FolderOpen, label: 'Portfolio',  path: '/portfolio', desc: 'Selected case studies, project outcomes, and the impact we have delivered for clients.' },
      { icon: GraduationCap, label: 'Courses', path: '/services#courses', desc: 'Three-month mentored courses, each with its month-by-month plan published before you pay.' },
    ],
  },
  {
    section: 'Content',
    color: 'var(--accent)',
    pages: [
      { icon: BookOpen,   label: 'Blog',       path: '/blog',      desc: 'Long-form writing on engineering, design, AI, and building products that scale.' },
    ],
  },
  {
    section: 'Legal',
    color: 'var(--accent)',
    pages: [
      { icon: Shield,     label: 'Privacy Policy', path: '/privacy',  desc: 'How we collect, use, and protect your personal data, written in plain language.' },
      { icon: FileText,   label: 'Terms of Service', path: '/terms', desc: 'The rules of engagement: deliverables, payments, IP ownership, and liability.' },
      { icon: Cookie,     label: 'Cookie Policy', path: '/cookies',  desc: 'A complete list of every cookie this site may set, with opt-out instructions.' },
      { icon: Map,        label: 'Sitemap',    path: '/sitemap',   desc: 'You are here. A structured overview of every page on the CodeNode website.' },
    ],
  },
]

function SectionGroup({ group, gi }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: gi * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>{group.section}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      {/* Page cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem', marginBottom: '3rem' }}>
        {group.pages.map((page, pi) => {
          const Icon = page.icon
          const isCurrent = page.path === '/sitemap'
          return (
            <motion.div
              key={page.path}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: gi * 0.1 + pi * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={page.path}
                style={{ textDecoration: 'none', display: 'block' }}
                className="group"
              >
                <div style={{
                  padding: '1.25rem', borderRadius: '16px',
                  background: isCurrent ? 'var(--bg-card)' : 'var(--bg-card)',
                  border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--border)',
                  transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    if (!isCurrent) {
                      e.currentTarget.style.borderColor = 'var(--border-hover)'
                      e.currentTarget.style.transform = 'translateY(-3px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isCurrent ? 'var(--accent)' : 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Hover glow */}
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '16px', pointerEvents: 'none',
                    background: 'radial-gradient(circle at 0% 0%, var(--accent-glow) 0%, transparent 60%)',
                    opacity: 0, transition: 'opacity 0.3s',
                  }} className="group-hover:opacity-100" />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Icon + path row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <div style={{
                        width: '2.25rem', height: '2.25rem', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      }}>
                        <Icon style={{ width: '0.95rem', height: '0.95rem', color: 'var(--text-primary)' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isCurrent && (
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
                            letterSpacing: '0.12em', padding: '0.2rem 0.55rem', borderRadius: '999px',
                            background: 'var(--accent-glow)', color: 'var(--accent)',
                            border: '1px solid var(--accent)', textTransform: 'uppercase',
                          }}>You are here</span>
                        )}
                        <span style={{
                          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
                          color: 'var(--text-muted)', letterSpacing: '0.04em',
                        }}>{page.path}</span>
                      </div>
                    </div>

                    {/* Label */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <p style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '0.95rem', color: 'var(--text-primary)', margin: 0,
                      }}>{page.label}</p>
                      {!isCurrent && (
                        <ArrowUpRight style={{
                          width: '0.9rem', height: '0.9rem', color: 'var(--text-muted)',
                          transition: 'color 0.2s, transform 0.2s',
                        }} className="group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      )}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.78rem', lineHeight: 1.65,
                      color: 'var(--text-secondary)', margin: 0,
                    }}>{page.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default function SitemapPage() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh', paddingBottom: '6rem' }}>

      {/* Hero */}
      <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', paddingTop: 'clamp(6rem, 14vw, 7rem)', paddingBottom: 'clamp(2.5rem, 7vw, 4rem)', position: 'relative', overflow: 'hidden' }}>
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 80% at 88% 30%, var(--accent-glow), transparent 70%)',
        }} />

        <div className="container relative z-10" ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--text-muted)' }}>/ Navigation</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span className="chip text-[10px]">Sitemap</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {SITEMAP.reduce((n, g) => n + g.pages.length, 0)} pages indexed
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 500,
              fontSize: 'var(--step-5)', letterSpacing: '-0.028em',
              color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem',
            }}>Every page, <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>one place</em></h1>
            <p className="section-sub" style={{ maxWidth: '52ch' }}>
              A structured overview of the CodeNode website. Use this to find exactly what you are looking for, or to get a bird's-eye view of everything we offer.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sitemap grid */}
      <div className="container" style={{ paddingTop: '4rem' }}>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '0',
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid var(--border)', marginBottom: '3.5rem',
          }}
        >
          {[
            { label: 'Total Sections', value: String(SITEMAP.length) },
            { label: 'Total Pages', value: String(SITEMAP.reduce((n, g) => n + g.pages.length, 0)) },
            { label: 'Last Updated', value: 'Apr 2026' },
            { label: 'Status', value: 'All Live' },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{
              flex: '1 1 140px', padding: '1.25rem 1.5rem',
              borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: 'var(--bg-card)',
            }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{stat.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Groups */}
        {SITEMAP.map((group, gi) => (
          <SectionGroup key={group.section} group={group} gi={gi} />
        ))}

      </div>
    </div>
  )
}
