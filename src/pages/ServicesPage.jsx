import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import PageHero, { Em } from '../components/ui/PageHero'
import SectionHeader from '../components/ui/SectionHeader'
import {
  Zap, ArrowRight, CheckCircle2, Clock, GitBranch, HeartHandshake,
  Rocket, Lock, Headphones, Trophy,
} from 'lucide-react'
import { useContact } from '../context/ContactContext'
import { ImagePlate } from '../components/ui/EditorialImage'
import { img, TEXTURE } from '../data/imagery'
import CourseCard from '../components/ui/CourseCard'
import { useServices, useCourses } from '../hooks/useSiteContent'
import { iconFor } from '../lib/icons'
import { CountWord } from '../lib/words'

export default function ServicesPage() {
  const { openContact } = useContact()
  const services = useServices()
  return (
    <>
      <PageHero
        label="Services"
        title={<>{CountWord(services.length)} disciplines you can <Em>buy separately</Em></>}
        sub={<>Each one is a standalone engagement. Most projects combine two or three, and
          we'll tell you which after a discovery call, including when the answer is "fewer".</>}
      />

      {/* Services grid */}
      <section className="section" style={{ background:'var(--bg-surface)' }}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => {
              const Icon = iconFor(s.icon)
              return (
                <motion.div key={s.slug ?? s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:'-60px' }} transition={{ delay:(i%2)*.1, duration:.6 }}
                  className="card p-8 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[18px] pointer-events-none"
                    style={{ background:'radial-gradient(circle at 0% 0%, var(--accent-glow) 0%, transparent 55%)' }} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="chip text-[10px]">{s.price}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '1.375rem',
                                 letterSpacing: '-0.015em', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color:'var(--text-secondary)' }}>{s.desc}</p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {(s.features ?? []).map(f => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent" />
                          <span className="text-xs" style={{ color:'var(--text-secondary)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={openContact} className="tap inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', padding:0, textDecoration:'underline', textUnderlineOffset:'4px' }}>
                      Get a quote <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <WhyUsSection />
      <GuaranteeSection />
      <CoursesSection />
    </>
  )
}

/* ─── WHY CHOOSE US ────────────────────────────────────────────── */
const WHY_US = [
  { icon: Rocket,       stat: '3×',   color: 'var(--brand)', title: 'Faster Time-to-Market',   desc: 'Our battle-tested sprint framework cuts typical agency timelines by two-thirds, without skipping a single quality gate.' },
  { icon: Lock,         stat: '100%', color: 'var(--brand)', title: 'IP Fully Owned by You',    desc: 'Every line of code and asset belongs to you from day one. We sign an IP assignment clause in every contract, with no exceptions.' },
  { icon: Headphones,   stat: '24/7', color: 'var(--brand)', title: 'Always-On Support',        desc: 'Real humans, fast responses, zero ticket limbo. Your dedicated team is one Slack message away, around the clock.' },
  { icon: Trophy,       stat: '98%',  color: 'var(--brand)', title: 'Client Satisfaction',      desc: 'Measured after every engagement, not cherry-picked. Most clients come back for a second project.' },
]

function WhyUsSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'var(--border)' }} />
      <div className="container">
          <SectionHeader
            num="02"
            label="Advantage"
            title={[{ t: 'Why teams keep ' }, { t: 'coming back', em: true }]}
            inView={inView}
            className="mb-12"
          />

        <div className="grid sm:grid-cols-2 gap-5">
          {WHY_US.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative card p-8 overflow-hidden" style={{ borderRadius: 20 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${item.color}22 0%, transparent 60%)` }} />
                <div className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500,
                                 fontSize: '2.25rem', letterSpacing: '-0.025em', color: item.color }}>{item.stat}</span>
                  </div>
                  <h3 className="font-syne font-bold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── GUARANTEE SECTION ────────────────────────────────────────── */
const GUARANTEES = [
  { icon: Clock,          stat: '97%',  statSub: 'on-time delivery rate',         title: 'Deadline or Discount',    desc: 'We set realistic timelines upfront and protect them ruthlessly. Miss a milestone? You get a credit on the next sprint. No excuses, no exceptions.' },
  { icon: Zap,            stat: '<1s',  statSub: 'load time on all web builds',   title: 'Speed as a Feature',      desc: 'Every web product ships only after passing our Core Web Vitals audit. Lighthouse scores are baked into our definition of done, not an afterthought.' },
  { icon: GitBranch,      stat: '100%', statSub: 'IP ownership from day one',     title: 'Your Code, Always',       desc: 'Full source ownership, documented CI/CD pipelines, and a recorded architecture walkthrough. Zero vendor lock-in, ever.' },
  { icon: HeartHandshake, stat: '3 mo', statSub: 'post-launch support included',  title: 'We Stay After Launch',    desc: "Three months of bug fixes, uptime monitoring, and direct Slack access to the engineers who built it, because shipping is the beginning, not the end." },
]

function GuaranteeSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section ref={ref} className="section relative" style={{ background: 'var(--bg-surface)', overflow: 'hidden' }}>
      <ImagePlate src={img(TEXTURE.sandstone, 1600, 1000)} />
      <div className="absolute top-0 inset-x-0 h-[1px] z-[1]" style={{ background: 'var(--border)' }} />
      <div className="container relative" style={{ zIndex: 1 }}>
          <SectionHeader
            num="03"
            label="Promise"
            title={[{ t: 'Commitments, ' }, { t: 'not assurances', em: true }]}
            subtitle="Vague promises are easy. These are specific and measurable, and we back them."
            inView={inView}
            className="mb-12"
          />
        <div className="grid sm:grid-cols-2 gap-5">
          {GUARANTEES.map((g, i) => {
            const Icon = g.icon
            return (
              <motion.div key={g.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative card p-8 overflow-hidden" style={{ borderRadius: 20 }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 0% 100%, var(--accent-glow) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="tnum select-none"
                      style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '2.5rem',
                               lineHeight: 1, color: 'var(--brand)', opacity: 0.35 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-syne font-extrabold text-4xl" style={{ color: 'var(--text-primary)' }}>{g.stat}</span>
                    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{g.statSub}</span>
                  </div>
                  <div className="h-px my-4" style={{ background: 'var(--border)' }} />
                  <h3 className="font-syne font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.55, duration: 0.6 }}
          className="mt-10 text-center font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Every engagement. No fine print.
        </motion.p>
      </div>
    </section>
  )
}

/* ─── COURSES TEASER ───────────────────────────────────────────────
   The catalogue itself lives on /courses now. This keeps the teaching side
   in the story of the services page, and keeps the old /services#courses
   anchor landing on something that makes sense. */
function CoursesSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const courses = useCourses()

  /* One per field, so the strip shows the range rather than the first four
     courses in the catalogue's own order. */
  const sample = React.useMemo(() => {
    const seen = new Set()
    return courses.filter(c => {
      if (seen.has(c.field)) return false
      seen.add(c.field)
      return true
    }).slice(0, 4)
  }, [courses])

  return (
    <section id="courses" ref={ref} className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <SectionHeader
          num="04"
          label="Courses"
          title={[{ t: 'We also ' }, { t: 'teach this work', em: true }]}
          subtitle={`${courses.length} three-month mentored courses, each with its month-by-month plan published before you pay. Written so a complete beginner can follow it.`}
          action={{ to: '/courses', label: 'All courses' }}
          inView={inView}
          className="mb-10"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sample.map((c, i) => <CourseCard key={c.slug} c={c} i={i} />)}
        </div>

        <div className="course-cta" style={{ marginTop: '2.5rem' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)', maxWidth: '58ch' }}>
            Not sure which one fits? The course finder asks seven questions and names the
            three worth your time, with the reason for each.
          </p>
          <Link to="/courses" className="btn btn-primary micro-click">
            Find my three <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
