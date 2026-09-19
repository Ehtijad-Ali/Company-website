import React, { useState, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import { TEAM } from '../data/team'
import { E } from '../lib/motion'

/**
 * Posts carry an author *slug*, not a loose name string, so every byline
 * resolves to a real roster profile and can't drift out of sync with it.
 */
const POSTS = [
  { slug: 'saas-architecture', title: 'The architecture behind our busiest build yet',
    cat: 'Engineering', date: 'Jun 2026', read: 8, author: 'ehtijad-ali', featured: true,
    excerpt: 'The infrastructure decisions behind a platform that went from zero to real traffic in one release cycle, including the two we would make differently now.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=700&fit=crop' },
  { slug: 'llm-fine-tuning', title: 'Why LLM fine-tuning is overrated',
    cat: 'AI/ML', date: 'Jun 2026', read: 6, author: 'faiza-rehmat',
    excerpt: "When prompting, RAG and a large context window solve 80% of use cases, fine-tuning is an expensive answer to a question nobody asked.",
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop' },
  { slug: 'design-systems-cost', title: 'The real cost of design systems',
    cat: 'Design', date: 'May 2026', read: 5, author: 'almeen-zahra',
    excerpt: "A design system is a bet on the future. Here's how to work out whether the bet is worth making before you spend a quarter on it.",
    img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop' },
  { slug: 'core-web-vitals', title: 'Core Web Vitals: from 45 to 98 in three weeks',
    cat: 'Performance', date: 'May 2026', read: 7, author: 'faila-abbas',
    excerpt: 'A step-by-step account of diagnosing and removing every performance bottleneck in a legacy Next.js application.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop' },
  { slug: 'mobile-retention', title: 'Mobile retention: the metrics that actually matter',
    cat: 'Growth', date: 'Apr 2026', read: 4, author: 'kiran',
    excerpt: "D1, D7 and D30 are table stakes. These are the leading indicators that predict churn before it shows up in them.",
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop' },
  { slug: '3d-on-the-web', title: "3D on the web: what's worth using",
    cat: 'Engineering', date: 'Apr 2026', read: 9, author: 'faila-abbas',
    excerpt: 'Three.js, WebGPU, React Three Fiber, Babylon: an opinionated guide to which are worth your time and which are hype.',
    img: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&h=500&fit=crop' },
]

const CATS = ['All', ...new Set(POSTS.map(p => p.cat))]

const authorOf = slug => TEAM.find(m => m.slug === slug)

/** Byline shared by the lead and the grid cards. */
function Byline({ post, dark = false, showAvatar = true }) {
  const a = authorOf(post.author)
  const muted = dark ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'
  const strong = dark ? '#FFFCF8' : 'var(--text-primary)'

  return (
    <div className="flex items-center gap-2.5" style={{ fontSize: '0.75rem', color: muted }}>
      {showAvatar && a && (
        <img src={a.img} alt="" style={{
          width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top',
        }} />
      )}
      <span style={{ color: strong, fontWeight: 500 }}>{a?.name ?? 'CodeNode'}</span>
      <span style={{ opacity: 0.45 }}>·</span>
      <span>{post.date}</span>
      <span style={{ opacity: 0.45 }}>·</span>
      <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.read} min</span>
    </div>
  )
}

/** The lead story — a magazine front page gives one piece the space. */
function FeaturedPost({ post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: E }}
      className="group relative overflow-hidden"
      style={{ borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', boxShadow: 'var(--e-2)' }}
    >
      <Link to="/blog" className="block relative" style={{ minHeight: 'clamp(360px, 46vw, 500px)' }}>
        <img src={post.img} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: 'transform 0.8s var(--ease)' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(20,16,14,0.95) 0%, rgba(20,16,14,0.7) 45%, rgba(20,16,14,0.25) 100%)',
        }} />

        <div className="relative flex flex-col justify-end h-full"
          style={{ minHeight: 'clamp(360px, 46vw, 500px)', padding: 'clamp(1.75rem, 4vw, 3rem)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="chip" style={{ background: 'var(--brand)', color: 'var(--text-on-brand)', border: 'none' }}>
              {post.cat}
            </span>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.65)' }}>Featured</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--step-4)', fontWeight: 500,
            lineHeight: 1.1, letterSpacing: '-0.025em', color: '#FFFCF8',
            maxWidth: '20ch', textWrap: 'balance',
          }}>{post.title}</h2>

          <p style={{
            fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.72)',
            maxWidth: '56ch', margin: '1rem 0 1.75rem',
          }}>{post.excerpt}</p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <Byline post={post} dark />
            <span className="inline-flex items-center gap-2 eyebrow" style={{ color: '#FFFCF8' }}>
              Read article <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

const PostCard = React.forwardRef(function PostCard({ post, i }, ref) {
  return (
    <motion.article
      ref={ref} layout
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: (i % 3) * 0.07, duration: 0.55, ease: E }}
    >
      <Link to="/blog" className="card group flex flex-col h-full overflow-hidden" style={{ padding: 0 }}>
        <div className="img-zoom-wrap relative" style={{ aspectRatio: '16/10' }}>
          <img src={post.img} alt="" className="w-full h-full object-cover" />
          <span className="absolute chip" style={{ top: 12, left: 12, background: 'var(--bg-card)' }}>{post.cat}</span>
        </div>

        <div className="flex flex-col flex-1" style={{ padding: '1.25rem 1.375rem 1.375rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 500,
            lineHeight: 1.28, letterSpacing: '-0.015em', color: 'var(--text-primary)',
            marginBottom: '0.625rem', textWrap: 'balance',
          }}>{post.title}</h3>

          <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-secondary)', marginBottom: '1.25rem', flex: 1 }}>
            {post.excerpt}
          </p>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--divider)' }}>
            <Byline post={post} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
})

export default function BlogPage() {
  const [cat, setCat] = useState('All')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const featured = POSTS.find(p => p.featured) ?? POSTS[0]
  const rest = useMemo(
    () => POSTS.filter(p => p !== featured && (cat === 'All' || p.cat === cat)),
    [cat, featured]
  )

  return (
    <>
      <section className="section pt-36" style={{ background: 'var(--bg-surface)', paddingBottom: '3.5rem' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: E }}
            className="mb-10"
          >
            <p className="eyebrow mb-3">
              <span style={{ color: 'var(--brand)' }}>01</span>
              <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>Journal
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--step-5)', fontWeight: 500,
              lineHeight: 1.05, letterSpacing: '-0.028em', color: 'var(--text-primary)',
            }}>
              What we learned <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>building it</em>
            </h1>
            <p className="section-sub mt-4">
              Field notes from live engagements: the decisions, the trade-offs, and
              the things we would do differently. Written by the people who did the work.
            </p>
          </motion.div>

          <FeaturedPost post={featured} />
        </div>
      </section>

      <section ref={ref} className="section" style={{ background: 'var(--bg)', paddingTop: '3.5rem' }}>
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex flex-wrap">
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className="relative pb-3 mr-6 eyebrow"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: cat === c ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}>
                  {c}
                  {cat === c && (
                    <motion.div layoutId="blog-underline"
                      style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 1.5, background: 'var(--brand)' }}
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }} />
                  )}
                </button>
              ))}
            </div>
            <p className="eyebrow pb-3">{rest.length} article{rest.length === 1 ? '' : 's'}</p>
          </div>

          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {rest.map((p, i) => <PostCard key={p.slug} post={p} i={i} />)}
            </AnimatePresence>
          </motion.div>

          {rest.length === 0 && (
            <p className="section-sub" style={{ padding: '3rem 0' }}>
              Nothing in {cat} yet.{' '}
              <button onClick={() => setCat('All')}
                style={{ color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                Show all articles
              </button>.
            </p>
          )}
        </div>
      </section>

      {/* Close — the journal exists to start conversations */}
      <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: E }}
            className="card flex flex-wrap items-center justify-between gap-6"
            style={{ padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            <div style={{ maxWidth: '46ch' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', fontWeight: 500,
                letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2,
              }}>
                Working on something similar?
              </h2>
              <p className="section-sub mt-3">
                Most of these posts started as a client problem. Tell us yours and
                we'll say honestly whether we're the right people for it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-primary micro-click">
                Start a project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/team" className="btn btn-secondary">Meet the authors</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
