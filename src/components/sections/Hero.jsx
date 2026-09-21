import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, Cloud } from 'lucide-react'
import { TypingText, ParallaxSection } from '../ui/AnimationKit'
import { METRICS, format } from '../../data/metrics'
import { TECH_ICONS } from '../../data/techIcons'
import { E } from '../../lib/motion'

/* Pulled from the shared source so the hero can't drift from the stats
   section again — it previously claimed 500+ projects against its 60+. */
const STATS = ['projects', 'satisfaction', 'avgExperience', 'countries'].map(k => ({
  value: format(k),
  label: METRICS[k].label,
}))

/* Marks and colours live in the catalogue so the real brand paths are not
   pasted into a layout file. `color: null` means the mark is monochrome in
   its own branding (Next.js, Three.js) and takes the page's ink instead of
   an invented hue. */
const TECH = TECH_ICONS

/* Headline set as roman + italic, the way a masthead is set —
   the italic carries the emphasis so nothing has to shout. */
const LINES = [
  [{ t: 'We build' }],
  [{ t: 'what others' }],
  [{ t: 'only ' }, { t: 'imagine.', italic: true }],
]

/* ─── Syntax colours — drawn from the palette, not a stock dark theme ─── */
const K = 'var(--syn-keyword)'
const S = 'var(--syn-string)'
const F = 'var(--syn-fn)'
const D = 'var(--terminal-text)'
const C = 'var(--terminal-comment)'
const G = 'var(--syn-ok)'
const Y = 'var(--syn-warn)'

const CODE_LINES = [
  [[C, '# CodeNode · AI Stack Configuration']],
  null,
  [[K,'from'],[D,' codenode.ai '],[K,'import'],[D,' '],[F,'Agent'],[D,', '],[F,'Pipeline']],
  [[K,'from'],[D,' codenode.tools '],[K,'import'],[D,' '],[F,'search'],[D,', '],[F,'execute']],
  null,
  [[F,'agent'],[D,' = '],[F,'Agent'],[D,'(']],
  [[D,'    model='],[S,'"claude-opus-4"'],[D,',']],
  [[D,'    tools=['],[F,'search'],[D,', '],[F,'execute'],[D,'],']],
  [[D,'    memory='],[K,'True'],[D,',']],
  [[D,')']],
  null,
  [[Y,'@agent.on'],[D,'('],[S,'"reasoning"'],[D,')']],
  [[K,'async'],[D,' '],[K,'def'],[D,' '],[F,'handle_step'],[D,'(step):']],
  [[D,'    '],[F,'print'],[D,'('],[S,'f"→ {step.thought}"'],[D,')']],
  null,
  [[F,'pipeline'],[D,' = '],[F,'Pipeline'],[D,'([']],
  [[D,'    agent.'],[F,'analyse'],[D,',']],
  [[D,'    agent.'],[F,'synthesise'],[D,',']],
  [[D,'    agent.'],[F,'report'],[D,',']],
  [[D,'])']],
  null,
  [[D,'result = '],[K,'await'],[D,' '],[F,'pipeline'],[D,'.'],[F,'run'],[D,'(']],
  [[D,'    task='],[S,'"Optimise tech stack"'],[D,',']],
  [[D,')']],
  null,
  [[C,'# → Loading context...']],
  [[C,'# → Analysing stack...']],
  [[C,'# → Generating plan...']],
  [[G,'# ✓ Done in 1.8s']],
]

function CodeTerminal() {
  const [shown, setShown]   = useState(0)
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    if (shown >= CODE_LINES.length) {
      const id = setTimeout(() => setShown(0), 3200)
      return () => clearTimeout(id)
    }
    const isBlank = CODE_LINES[shown] === null
    const id = setTimeout(() => setShown(v => v + 1), isBlank ? 50 : 360)
    return () => clearTimeout(id)
  }, [shown])

  useEffect(() => {
    const id = setInterval(() => setCursor(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  const WINDOW = 15
  const offset = Math.max(0, shown - WINDOW)
  const frameLines = Array.from({ length: WINDOW }, (_, i) => CODE_LINES[offset + i] ?? null)

  /* 15 lines × (0.72rem × 1.72 line-height) = 18.576rem */
  const CODE_H = '18.576rem'

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.9, ease: E }}
      style={{
        background: 'var(--terminal-bg)',
        border: '1px solid var(--terminal-border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--e-4)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header — a filename and a status, not a fake macOS chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.7rem 1.1rem', flexShrink: 0,
        borderBottom: '1px solid var(--terminal-divider)',
        background: 'var(--terminal-header)',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.66rem', color: 'var(--terminal-label)', letterSpacing: '0.02em' }}>
          agent.py
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--syn-ok)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terminal-label)' }}>running</span>
        </div>
      </div>

      {/* Code area — fixed height so the card stays stable */}
      <div style={{ flex: 1, padding: '1rem 1.4rem', overflow: 'hidden', minHeight: CODE_H }}>
        <pre style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.72rem',
          lineHeight: 1.72,
          margin: 0, padding: 0,
          whiteSpace: 'pre',
          minHeight: CODE_H,
        }}>
          {frameLines.map((line, li) =>
            line === null
              ? <div key={li} style={{ height: '1.72em' }} />
              : (
                <div key={li}>
                  {line.map(([col, txt], ti) => (
                    <span key={ti} style={{ color: col }}>
                      {txt}
                    </span>
                  ))}
                </div>
              )
          )}
          <span style={{ opacity: cursor ? 1 : 0, color: D }}>▌</span>
        </pre>
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.5rem 1.1rem', flexShrink: 0,
        borderTop: '1px solid var(--terminal-divider)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: 'var(--terminal-footer)' }}>
          Python 3.12 · UTF-8
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: 'var(--terminal-footer)' }}>
          Ln {shown}, Col 1
        </span>
      </div>
    </motion.div>
  )
}

/* `layered`: HeroSequence paints the ground behind the hero, so the hero
   drops its own opaque background and plate. */
export default function Hero({ layered = false }) {
  const ref    = useRef(null)
  const reduce = useReducedMotion()

  /* Scrolling out of the hero separates it into planes: the copy hangs
     back a little, the terminal pulls ahead, the texture behind them both
     drifts slower still. Nothing moves far — the effect is depth, not
     travel, and it is what stops the fold reading as a flat poster. */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const termY = useTransform(scrollYProgress, [0, 1], [0, -50])
  /* Layered, the fade belongs to HeroSequence: this section is sticky, so
     its own progress freezes the moment it pins and would leave the copy
     stranded half-dimmed over the frames. Standalone, it still fades here. */
  const ownFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])
  const fade = layered ? undefined : ownFade

  return (
    <section id="home" ref={ref} className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: layered ? 'transparent' : 'var(--bg)' }}>

      

      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% -5%, var(--glow), transparent)' }} />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.6, ease: E }}
        className="container relative z-10 flex items-center justify-between"
        style={{ paddingTop: '7rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-7">
          <span className="eyebrow" style={{ color: 'var(--text-primary)' }}>CodeNode Studio</span>
          <span className="hidden sm:block" style={{ width: 1, height: 12, background: 'var(--divider)' }} />
          <span className="eyebrow">Strategy · Design · Engineering</span>
        </div>
        <span className="badge">
          <span className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--brand)', animation: 'pulse-ring 2.4s ease-in-out infinite' }} />
          Taking on work for Q3
        </span>
      </motion.div>

      {/* Two-column hero — items-stretch so terminal matches left height */}
      <div className="container relative z-10 flex-1 grid lg:grid-cols-[1fr_1fr] gap-12 xl:gap-20 items-stretch py-14">

        {/* ── Left: content ── */}
        <motion.div className="flex flex-col justify-center"
          style={reduce ? undefined : { y: copyY, opacity: fade }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: E }}
            className="eyebrow mb-7"
          >
            <span style={{ color: 'var(--brand)' }}>01</span>
            <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>
            Digital product studio
          </motion.p>

          {LINES.map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: '104%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.28 + i * 0.11, duration: 0.95, ease: E }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--step-6)',
                  fontWeight: 500,
                  lineHeight: 1.04,
                  letterSpacing: '-0.028em',
                  color: 'var(--text-primary)',
                  paddingBottom: '0.06em',
                }}
              >
                {line.map((part, pi) =>
                  part.italic ? (
                    <em key={pi} style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>
                      {part.t}
                    </em>
                  ) : (
                    <span key={pi}>{part.t}</span>
                  )
                )}
              </motion.h1>
            </div>
          ))}

          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: E }}
            style={{ height: '1px', background: 'var(--divider)', transformOrigin: 'left', margin: '2.25rem 0 1.75rem' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7, ease: E }}
            className="section-sub mb-8"
            style={{ maxWidth: '46ch' }}
          >
            We design and build{' '}
            <TypingText
              words={['AI-driven platforms.', 'immersive 3D experiences.', 'enterprise web apps.', 'design systems that hold up.']}
              speed={62}
              pauseMs={1800}
              style={{ color: 'var(--text-primary)', fontWeight: 500 }}
            />
            <br />
            Small team, senior hands, no handoffs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: E }}
            className="flex gap-3 flex-wrap items-center"
          >
            <Link to="/contact" className="btn btn-primary micro-click">
              Start a project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/portfolio" className="btn btn-secondary">
              See our work
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Right: code terminal ── */}
        <motion.div style={reduce ? undefined : { y: termY, opacity: fade }}>
          <CodeTerminal />
        </motion.div>

      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.7 }}
        className="container relative z-10 grid grid-cols-2 md:grid-cols-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {STATS.map(({ value, label }, i) => (
          <div key={label} className="py-7 px-4"
            style={{ borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
            <p className="tnum"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-3)', fontWeight: 500,
                       lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{value}</p>
            <p className="eyebrow mt-2" style={{ letterSpacing: '0.16em' }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Tech ticker */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="relative z-10 overflow-hidden py-4"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}
      >
        <div className="flex anim-marquee" style={{ width: 'max-content' }}>
          {[...TECH, ...TECH].map((t, i) => (
            <div key={i} className="tech-tick"
              style={t.color ? { '--tech': t.color } : undefined}>
              {t.path
                ? (
                  <svg className="tech-mark" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={t.path} />
                  </svg>
                )
                /* AWS has no mark in the icon set, so it gets a generic
                   cloud rather than a logo we are not entitled to draw. */
                : <Cloud className="tech-mark" strokeWidth={1.75} aria-hidden="true" />}
              <span className="tech-name">{t.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  )
}
