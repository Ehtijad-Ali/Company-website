import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import { E, DUR, RISE } from '../../lib/motion'
import { avatarFallback } from '../../lib/avatar'

const TESTIMONIALS = [
  {
    name: 'John Smith',
    role: 'CEO',
    company: 'TechStart Inc.',
    rating: 5,
    metric: '+42%',
    metricLabel: 'Conversion rate',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    text: 'CodeNode transformed our entire platform in 6 weeks. Performance gains were beyond what we expected. Conversion rate jumped 42%.',
  },
  {
    name: 'Sarah Johnson',
    role: 'CMO',
    company: 'BrandCo',
    rating: 5,
    metric: '3×',
    metricLabel: 'Lead generation',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    text: 'The redesign was jaw-dropping. Not just beautiful, it converts. 3x lead generation in the first month post-launch.',
  },
  {
    name: 'Michael Chen',
    role: 'Founder',
    company: 'StartupHub',
    rating: 5,
    metric: '6 wks',
    metricLabel: 'Full delivery',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    text: "Their AI integration turned our raw data into real business intelligence. The team's depth of knowledge is unparalleled.",
  },
  {
    name: 'Priya Patel',
    role: 'CTO',
    company: 'HealthTech',
    rating: 5,
    metric: '0',
    metricLabel: 'Tech debt left',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    text: "We've worked with many agencies. CodeNode stands alone. Their attention to code quality saved us months of technical debt.",
  },
  {
    name: 'Lucas Schmidt',
    role: 'Director',
    company: 'EuroBank',
    rating: 5,
    metric: '0',
    metricLabel: 'Downtime on launch',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    text: 'Trusted them with our core banking UI rebuild. Zero downtime, perfect execution, genuinely world-class result.',
  },
  {
    name: 'Yuna Kim',
    role: 'Head of Product',
    company: 'SaasCo',
    rating: 5,
    metric: '+28',
    metricLabel: 'NPS points',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    text: 'From discovery to launch in 10 weeks. The collaborative process was smooth, the code is pristine, NPS up 28 points.',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const prev = () => setActive(a => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setActive(a => (a + 1) % TESTIMONIALS.length)

  /* The quotes advance on their own once the section is on screen —
     six testimonials nobody clicks through are five testimonials nobody
     reads. `active` is a dependency so a manual click buys a full dwell
     rather than being cut short by a timer already half spent. It holds
     while the pointer or keyboard focus is inside, and never starts at
     all for anyone who asked for reduced motion. */
  useEffect(() => {
    if (reduce || paused || !inView) return
    const id = setTimeout(next, 7000)
    return () => clearTimeout(id)
  }, [active, paused, inView, reduce])

  const t = TESTIMONIALS[active]

  return (
    <section id="testimonials" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">

        <SectionHeader
          num="06"
          label="Clients"
          title={[{ t: 'What they said ' }, { t: 'afterwards', em: true }]}
          inView={inView}
          className="mb-12"
        />

        {/* Featured spotlight */}
        <motion.div
          initial={{opacity: 0, y: RISE }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{delay: .2, duration: DUR.reveal, ease: E }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* No box: the quote sits on the section ground, and the one
              hairline between the two columns does the work the card
              outline used to. */}
          {/* `grid-cols-1` is minmax(0, 1fr): the bare `grid` track sized to
              min-content, so the dot row pushed the column 20px past a
              phone's edge and cut the next arrow off. */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">

            {/* Left — quote */}
            <div className="flex flex-col justify-between lg:pr-10">

              {/* Big metric */}
              <div className="flex items-start gap-6 mb-6">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={active + '-metric'}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: .35 }}
                      className="font-syne font-extrabold leading-none"
                      style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', color: 'var(--accent)' }}
                    >{t.metric}</motion.p>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={active + '-mlabel'}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: .3 }}
                      className="font-mono text-[10px] uppercase tracking-widest mt-1"
                      style={{ color: 'var(--text-muted)' }}
                    >{t.metricLabel}</motion.p>
                  </AnimatePresence>
                </div>
                <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />
                <div className="flex items-center gap-1.5 pt-1">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Verified result</span>
                </div>
              </div>

              {/* Quote text */}
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={active + '-text'}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: .4, ease: E }}
                  className="font-syne font-medium text-lg md:text-xl leading-relaxed mb-7"
                  style={{ color: 'var(--text-primary)' }}
                >
                  "{t.text}"
                </motion.blockquote>
              </AnimatePresence>

              {/* Client + nav */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active + '-client'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: .3 }}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={t.img} alt={t.name}
                      className="w-11 h-11 rounded-full object-cover"
                      style={{ outline: '2px solid var(--accent)', outlineOffset: 2 }}
                      onError={avatarFallback(t.name, 100)}
                    />
                    <div>
                      <p className="font-syne font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                      <p className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{t.role} · {t.company}</p>
                    </div>
                    <div className="flex ml-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Previous testimonial"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  ><ChevronLeft className="w-4 h-4" /></button>

                  <div className="flex gap-1.5">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i} onClick={() => setActive(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        aria-current={i === active}
                        /* 44px wide each, six dots plus two arrows came to
                           ~390px — wider than a phone's content box. They
                           narrow to 28px under sm and keep the 44px height. */
                        className="flex items-center justify-center min-w-[28px] sm:min-w-[44px]"
                        style={{
                          height: 44, background: 'none',
                          border: 'none', cursor: 'pointer', padding: 0,
                        }}
                      >
                        <span className="rounded-full transition-all duration-300" style={{
                          display: 'block',
                          width: i === active ? '1.75rem' : '0.5rem',
                          height: '0.5rem',
                          background: i === active ? 'var(--brand)' : 'var(--border)',
                        }} />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={next}
                    aria-label="Next testimonial"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  ><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Right — client list */}
            <div
              className="hidden lg:flex flex-col justify-center gap-1.5 pl-8"
              style={{ borderLeft: '1px solid var(--divider)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>All clients</p>
              {TESTIMONIALS.map((c, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActive(i)}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 py-2.5 pl-3 text-left transition-all duration-200"
                  style={{
                    /* The active client is marked with a rule, not a box —
                       a boxed row inside a boxless section reads as debris. */
                    borderLeft: `2px solid ${i === active ? 'var(--brand)' : 'transparent'}`,
                  }}
                >
                  <img
                    src={c.img} alt={c.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                    onError={avatarFallback(c.name, 100)}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-syne font-semibold text-xs truncate" style={{ color: i === active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{c.name}</p>
                    <p className="font-mono text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{c.company}</p>
                  </div>
                  {i === active && (
                    <span className="font-syne font-bold text-xs shrink-0" style={{ color: 'var(--accent)' }}>
                      {c.metric}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* The trust bar that sat here repeated the stats section two
            sections up — projects and satisfaction were on this page three
            times. The quotes now end the section on their own. */}
      </div>

    </section>
  )
}
