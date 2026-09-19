import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import SectionHeader from '../components/ui/SectionHeader'
import { format } from '../data/metrics'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, ExternalLink, ArrowRight, MessageSquare, Layers, Rocket } from 'lucide-react'

const ALL_PROJECTS = [
  { title:'NeuroCommerce', cat:'AI/ML',    year:'2026', client:'RetailMax Corp',
    desc:'AI-powered e-commerce platform with real-time personalisation and predictive inventory. Increased revenue by 58%.',
    img:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=600&fit=crop',
    tags:['React','TensorFlow','Node.js','PostgreSQL'], featured:true },
  { title:'HealthPulse',   cat:'Mobile',   year:'2026', client:'WellPath Inc',
    desc:'Cross-platform health monitoring app with ML-driven biometric insights and wearable device sync.',
    img:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=600&fit=crop',
    tags:['React Native','Python','FastAPI'] },
  { title:'Aether CRM',    cat:'SaaS',     year:'2026', client:'SalesForce Pro',
    desc:'Next-gen CRM featuring an AI sales assistant, automated pipeline management, and predictive close rates.',
    img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop',
    tags:['Next.js','PostgreSQL','Redis'] },
  { title:'MetaVerse Hub', cat:'Web3',     year:'2025', client:'MetaSpace DAO',
    desc:'Immersive 3D virtual workspace with WebXR presence and on-chain identity/ownership layer.',
    img:'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=900&h=600&fit=crop',
    tags:['Three.js','Solidity','WebXR'], featured:true },
  { title:'FlowDesk',      cat:'SaaS',     year:'2025', client:'Notion Alternative',
    desc:'Real-time collaborative design tool built in the browser. Live cursors, conflict resolution, export engine.',
    img:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&h=600&fit=crop',
    tags:['WebSockets','Canvas API','React'] },
  { title:'SkyAnalytics',  cat:'AI/ML',    year:'2025', client:'AgriTech Global',
    desc:'Satellite imagery analysis platform powering crop yield predictions and precision agriculture at scale.',
    img:'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop',
    tags:['PyTorch','GIS','FastAPI'] },
  { title:'PayFlow',       cat:'FinTech',  year:'2025', client:'NeoBank',
    desc:'Real-time payment processing platform with sub-100ms transaction times and a full audit trail.',
    img:'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=600&fit=crop',
    tags:['Node.js','Kafka','PostgreSQL'] },
  { title:'EduSpace',      cat:'EdTech',   year:'2025', client:'LearnerLab',
    desc:'Adaptive learning platform with AI tutor, live collaboration, and personalised curriculum generation.',
    img:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=600&fit=crop',
    tags:['React','LangChain','AWS'] },
  { title:'GreenTrack',    cat:'SaaS',     year:'2025', client:'EcoMetrics',
    desc:'ESG reporting and carbon tracking platform for Fortune 500 sustainability teams.',
    img:'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&h=600&fit=crop',
    tags:['Next.js','D3.js','Prisma'] },
]

const CATS = ['All','AI/ML','SaaS','Mobile','Web3','FinTech','EdTech']

export default function PortfolioPage() {
  const [cat, setCat] = useState('All')
  const shown = cat === 'All' ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.cat === cat)

  return (
    <>
      {/* Grid */}
      <section className="section pt-36" style={{ background:'var(--bg-surface)' }}>
        <div className="container">
          <SectionHeader
            num="01"
            label="Portfolio"
            title={[{ t: 'Work we can ' }, { t: 'point at', em: true }]}
            subtitle="Selected engagements across fintech, health, e-commerce and SaaS, each with the outcome it was measured on."
            as="h1"
            className="mb-12"
          />

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="relative px-4 py-2 rounded-xl text-sm font-medium"
                style={{ color: cat===c ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {cat===c && (
                  <motion.span layoutId="port-page-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background:'var(--accent-glow)', border:'1px solid var(--border)' }}
                    transition={{ type:'spring', bounce:.15 }} />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <motion.div key={p.title} layout
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:.9 }}
                  transition={{ delay:i*.06 }}
                  className="port-item card overflow-hidden group cursor-pointer"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio:'16/10' }}>
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                    <div className="port-overlay">
                      <div className="absolute bottom-5 left-5 right-5">
                        <p className="font-mono text-xs text-white/60 mb-1">{p.client}</p>
                        <p className="font-syne font-bold text-white text-lg mb-2">{p.title}</p>
                        <p className="text-sm text-white/70 mb-3">{p.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.tags.map(t => (
                            <span key={t} className="px-2 py-1 rounded-full font-mono text-[10px]"
                              style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)' }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <button className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background:'rgba(255,255,255,0.15)' }}>
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="chip text-[10px]">{p.cat}</span>
                      {p.featured && <span className="chip text-[10px]">Featured</span>}
                    </div>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop:'1px solid var(--border)' }}>
                    <div>
                      <p className="font-syne font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{p.title}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color:'var(--text-secondary)' }}>{p.year} · {p.client}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {[Github, ExternalLink].map((Icon, ii) => (
                        <button key={ii} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background:'var(--bg)', border:'1px solid var(--border)' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color:'var(--text-secondary)' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <ImpactMarqueeSection />
      <ProjectTimeline />
      <StartProjectSection />

    </>
  )
}

/* ── Section 1: Triple-row Impact Marquee ─────────────────────────────── */

const MARQUEE_ROW1 = ['58% Revenue ↑', '4.9★ Average Rating', '31% Fewer False Positives', '24+ Projects Delivered', '99.9% Uptime', '<1s Load Time', '180% Organic Growth', '40% Faster Pipeline', '2.4x Return on Ad Spend']
const MARQUEE_ROW2 = ['React', 'Next.js', 'TensorFlow', 'Three.js', 'Solidity', 'Python', 'Kubernetes', 'LangChain', 'WebXR', 'PostgreSQL', 'Kafka', 'D3.js', 'Framer Motion', 'Stripe', 'Redis']
const MARQUEE_ROW3 = ['E-Commerce Platforms', 'Mobile Health Apps', 'AI Assistants', 'Web3 Experiences', 'SaaS Dashboards', 'Payment Systems', 'EdTech Platforms', 'ESG Reporting Tools', 'Computer Vision Pipelines']

function MarqueeRow({ items, reverse = false, speed = 35, variant = 'default' }) {
  const doubled = [...items, ...items]

  const pill = {
    default: {
      padding: '0.7rem 1.6rem', borderRadius: '999px', border: '1px solid var(--border)',
      background: 'var(--bg-card)', fontFamily: 'var(--font-display)',
      fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
      whiteSpace: 'nowrap', letterSpacing: '-0.01em',
    },
    mono: {
      padding: '0.45rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
      background: 'transparent', fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-secondary)',
      whiteSpace: 'nowrap', letterSpacing: '0.06em',
    },
    label: {
      padding: '0.55rem 1.4rem', borderRadius: '999px', border: '1px solid transparent',
      background: 'var(--bg-surface)', fontFamily: 'var(--font-display)',
      fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)',
      whiteSpace: 'nowrap', letterSpacing: '-0.01em',
    },
  }[variant]

  return (
    <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
      <div style={{
        display: 'flex', gap: '1.25rem', width: 'max-content',
        animation: `${reverse ? 'marquee-r' : 'marquee-l'} ${speed}s linear infinite`,
      }}>
        {doubled.map((item, i) => (
          <div key={i} style={pill}>{item}</div>
        ))}
      </div>
    </div>
  )
}

function ImpactMarqueeSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{ background: 'var(--bg)', overflow: 'hidden', padding: '6rem 0', borderTop: '1px solid var(--border)' }}>
      <style>{`
        @keyframes marquee-l { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marquee-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>

      {/* Header — the marquee rows below stay full-bleed, so only the
          header takes the container gutter. */}
      <div className="container">
        <SectionHeader
          num="02"
          label="Impact"
          title={[{ t: 'Results that ' }, { t: 'held up', em: true }]}
          subtitle="Every engagement is tied to a measurable outcome. Here is what that looks like in aggregate."
          inView={inView}
          className="mb-12"
        />
      </div>

      {/* Three marquee rows */}
      <motion.div
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <MarqueeRow items={MARQUEE_ROW1} speed={38} variant="default" />
        <MarqueeRow items={MARQUEE_ROW2} reverse speed={28} variant="mono" />
        <MarqueeRow items={MARQUEE_ROW3} speed={44} variant="label" />
      </motion.div>
    </section>
  )
}

/* ── Section 2: Glowing Year Timeline ────────────────────────────────── */

const TIMELINE_DATA = [
  {
    year: '2026',
    projects: [
      { title: 'NeuroCommerce', cat: 'AI/ML',  client: 'RetailMax Corp', result: '+58% revenue', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&h=420&fit=crop' },
      { title: 'HealthPulse',   cat: 'Mobile', client: 'WellPath Inc',   result: '120k users',   img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=700&h=420&fit=crop' },
      { title: 'Aether CRM',    cat: 'SaaS',   client: 'SalesForce Pro', result: '40% faster pipeline', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=420&fit=crop' },
    ],
  },
  {
    year: '2025',
    projects: [
      { title: 'MetaVerse Hub', cat: 'Web3',   client: 'MetaSpace DAO',       result: '9k DAU at launch', img: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=700&h=420&fit=crop' },
      { title: 'FlowDesk',      cat: 'SaaS',   client: 'Notion Alternative',  result: '4k beta signups',  img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=700&h=420&fit=crop' },
      { title: 'SkyAnalytics',  cat: 'AI/ML',  client: 'AgriTech Global',     result: '94% prediction accuracy', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&h=420&fit=crop' },
    ],
  },
]

function TimelineCard({ project, i, fromRight }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromRight ? 40 : -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group card overflow-hidden"
      style={{ borderRadius: 16, cursor: 'default' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
        <img
          src={project.img} alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
          className="group-hover:scale-105"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
        }} />
        {/* Result badge */}
        <div style={{
          position: 'absolute', bottom: '0.875rem', left: '0.875rem',
          padding: '0.3rem 0.75rem', borderRadius: '999px',
          background: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.68rem', fontWeight: 700, color: '#000', letterSpacing: '0.04em',
        }}>{project.result}</div>
        <span style={{
          position: 'absolute', top: '0.75rem', left: '0.75rem',
          padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.65rem',
          background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
          fontFamily: 'JetBrains Mono, monospace',
        }}>{project.cat}</span>
      </div>

      {/* Footer */}
      <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{project.title}</p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{project.client}</p>
        </div>
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border)', background: 'var(--bg)',
        }}>
          <ArrowUpRight style={{ width: '0.85rem', height: '0.85rem', color: 'var(--text-secondary)' }} />
        </div>
      </div>
    </motion.div>
  )
}

function YearBlock({ group, yi }) {
  const dotRef = useRef(null)
  const dotInView = useInView(dotRef, { once: true, margin: '-40px' })

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

      {/* Left: year + glowing dot + vertical line */}
      <div ref={dotRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '0.25rem' }}>
        {/* Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={dotInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '1rem', height: '1rem', borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: dotInView ? '0 0 0 6px var(--accent-glow), 0 0 20px var(--accent)' : 'none',
            transition: 'box-shadow 0.6s ease',
            flexShrink: 0,
          }}
        />
        {/* Line */}
        {yi < TIMELINE_DATA.length - 1 && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={dotInView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '1px', flex: 1, minHeight: '3rem', marginTop: '0.5rem',
              background: 'linear-gradient(to bottom, var(--accent), var(--border))',
              transformOrigin: 'top',
            }}
          />
        )}
      </div>

      {/* Right: year label + cards */}
      <div style={{ flex: 1, paddingBottom: yi < TIMELINE_DATA.length - 1 ? '3.5rem' : 0 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={dotInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 500,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.035em', lineHeight: 1,
            color: 'var(--brand)', opacity: 0.32,
          }}>{group.year}</span>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {group.projects.map((p, i) => (
            <TimelineCard key={p.title} project={p} i={i} fromRight />
          ))}
        </div>
      </div>

    </div>
  )
}

function ProjectTimeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
      <div className="container">

        {/* Header */}
        <SectionHeader
          num="03"
          label="Timeline"
          title={[{ t: 'Built ' }, { t: 'year by year', em: true }]}
          subtitle="A living record of what we have shipped, from the earliest platforms to the AI-native products we build now."
          inView={inView}
          className="mb-12"
        />

        {/* Timeline blocks */}
        <div>
          {TIMELINE_DATA.map((group, yi) => (
            <YearBlock key={group.year} group={group} yi={yi} />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── Section 4: Start Your Project CTA ───────────────────────────────── */

const HOW_IT_WORKS = [
  { icon: MessageSquare, step: '01', title: 'Book a Discovery Call', desc: '30 minutes. No sales pitch, just an honest conversation about your goals and what\'s possible.' },
  { icon: Layers,        step: '02', title: 'Get a Tailored Proposal', desc: 'Scope, timeline, and investment, specific to your project, not a copy-paste template.' },
  { icon: Rocket,        step: '03', title: 'We Build & You Ship', desc: 'Kick off within a week. Weekly demos, full transparency, and a product you\'re proud of at the end.' },
]

function StartProjectSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
      <div className="container">

        <SectionHeader
          num="04"
          label="Start"
          title={[{ t: 'Every project here started with ' }, { t: 'one conversation', em: true }]}
          subtitle="Yours can too. A short discovery call, an honest scope, and a milestone plan."
          inView={inView}
          className="mb-12"
        />

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="card p-7 relative overflow-hidden group"
              style={{ borderRadius: 18 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 0% 100%, var(--accent-glow) 0%, transparent 65%)' }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-syne font-extrabold select-none"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '2.5rem',
                             lineHeight: 1, color: 'var(--brand)', opacity: 0.35 }}>{step}</span>
                </div>
                <h3 className="font-syne font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--step-3)',
                         marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              Let's make the next<br />case study yours.
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '28rem' }}>
              {format('projects')} projects shipped, clients in {format('countries')} countries, and a team that treats your product like its own.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/contact" className="btn btn-primary">
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="btn btn-secondary">
              View Services
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
