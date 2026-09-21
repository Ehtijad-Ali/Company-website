import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import { MessageSquare, Lightbulb, Layers, Rocket, BarChart2 } from 'lucide-react'
import { img, PHASE_IMG } from '../../data/imagery'
import { E, DUR, RISE } from '../../lib/motion'

const STEPS = [
  {
    icon: MessageSquare,
    num: '01',
    title: 'Discovery',
    phase: 'Week 1 to 2',
    desc: 'Deep-dive sessions to understand your goals, audience, and competitive landscape. We ask the hard questions others skip.',
    deliverables: ['Requirements doc', 'Competitor audit', 'Project brief'],
  },
  {
    icon: Lightbulb,
    num: '02',
    title: 'Strategy',
    phase: 'Week 2 to 3',
    desc: 'A tailored roadmap covering architecture, tech stack, design direction, and success metrics, before a single pixel is drawn.',
    deliverables: ['Tech spec', 'Design direction', 'Milestones'],
  },
  {
    icon: Layers,
    num: '03',
    title: 'Design & Build',
    phase: 'Week 3 to 10',
    desc: 'Iterative design sprints followed by agile engineering. You see progress every week, not just at the end.',
    deliverables: ['UI/UX designs', 'Working builds', 'Weekly reviews'],
  },
  {
    icon: Rocket,
    num: '04',
    title: 'Launch',
    phase: 'Week 10 to 11',
    desc: 'Production-grade deployment with full CI/CD, monitoring, and zero-downtime releases. We never just "push and pray".',
    deliverables: ['Live product', 'CI/CD pipeline', 'Monitoring setup'],
  },
  {
    icon: BarChart2,
    num: '05',
    title: 'Grow',
    phase: 'Ongoing',
    desc: 'Post-launch analytics, A/B testing, and iterative improvements keep compounding your results over time.',
    deliverables: ['Analytics reports', 'A/B tests', 'Optimisations'],
  },
]

/** Height of the connector's track, in px — shared by the CSS and the
 *  distance the spark travels, so the two cannot drift apart. */
const LINK_H = 56

/**
 * The live wire between two phases.
 *
 * Each link waits until it is actually on screen, then a spark runs from
 * the card above to the card below and leaves the line lit behind it. Read
 * at scrolling speed the current arrives at one phase, that phase lands,
 * and the next link picks it up — the sequence powers up a step at a time
 * rather than being drawn all at once on section entry.
 */
function PhaseLink() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -20% 0px' })

  return (
    <div className="phase-link" ref={ref} aria-hidden="true">
      <div className="phase-link-track" style={{ height: LINK_H }}>
        <motion.span
          className="phase-link-fill"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.span
          className="phase-link-spark"
          initial={{y: RISE, opacity: 0 }}
          animate={inView ? { y: LINK_H, opacity: [0, 1, 1, 0] } : {}}
          transition={{duration: DUR.reveal, ease: E, times: [0, 0.12, 0.72, 1] }}
        />
      </div>
      <motion.span
        className="phase-link-node"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.5, ease: E }}
      />
    </div>
  )
}

/**
 * One phase, one card.
 *
 * The timeline this replaced alternated cards left and right and used the
 * empty slot opposite each card for that phase's photograph — which meant
 * the picture only existed on desktop, and only ever beside the card. Here
 * every phase carries its own image inside its own full-width card, so all
 * five read the same way at every width — and `flip` alternates which side
 * that image sits on, keeping the left-right rhythm the timeline had.
 */
function PhaseCard({ icon: Icon, num, title, phase, desc, deliverables, src, flip }) {
  return (
    <article className={`card phase-card${flip ? ' phase-card--flip' : ''}`}>
      <div className="phase-body">
        <div className="phase-head">
          <span className="stat-badge">
            <Icon aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-syne font-bold text-[0.95rem]" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--accent)', opacity: 0.7 }}>{phase}</span>
          </div>
          <span className="phase-num" aria-hidden="true">
            <span className="phase-num-rule" />{num}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{desc}</p>

        <div className="flex flex-wrap gap-1.5">
          {deliverables.map(d => (
            <span
              key={d}
              className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >{d}</span>
          ))}
        </div>
      </div>

      {/* The photograph bleeds out of the card's own edge behind a fade back
          to the card surface, rather than sitting in a framed box. */}
      <div className="phase-shot">
        <img src={src} alt="" className="ed-img" loading="lazy" decoding="async"
          onError={e => { e.currentTarget.style.display = 'none' }} />
        <span className="ed-grain" aria-hidden="true" />
      </div>
    </article>
  )
}

export default function Process({ num = '03' }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="process" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">

        {/* Header */}
        <SectionHeader
          num={num}
          label="Process"
          title={[{ t: 'Five phases, ' }, { t: 'no surprises', em: true }]}
          subtitle="A framework that turns an idea into a shipped product, with a checkpoint you can act on at the end of each phase."
          inView={inView}
          className="mb-4"
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-14"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-full)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--brand)' }} />
          <span className="eyebrow" style={{ fontSize: '0.625rem' }}>5 phases · ~12 weeks</span>
        </div>

        {/* Phases, chained — the link between two cards is what makes the
            five read as one sequence rather than five separate offers. */}
        <div className="phase-stack">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              {/* Each card waits for its own scroll position rather than a
                  stagger off the section, so it lands just as the spark in
                  the link above it arrives. */}
              <motion.div
                initial={{opacity: 0, y: RISE }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
                transition={{duration: DUR.reveal, ease: E }}
              >
                <PhaseCard {...step} src={img(PHASE_IMG[i], 720, 540)} flip={i % 2 === 1} />
              </motion.div>

              {i < STEPS.length - 1 && <PhaseLink />}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{opacity: 0, y: RISE }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{delay: 1.2, duration: DUR.reveal, ease: E }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-8 py-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="font-syne font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Ready to start your project?
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Book a free 30-min discovery call, no strings attached.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary shrink-0">
            Start Discovery
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
