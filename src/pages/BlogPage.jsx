import React, { useState, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import PageHero, { Em } from '../components/ui/PageHero'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import { usePosts, usePostCats, useTeam } from '../hooks/useSiteContent'
import { E } from '../lib/motion'


/** Byline shared by the lead and the grid cards. */
function Byline({ post, dark = false, showAvatar = true }) {
  /* Resolved against the live roster: a post written by someone who has
     since left the team falls back to the studio name rather than breaking
     the card. */
  const a = useTeam().find(m => m.slug === post.author)
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
  const posts = usePosts()
  const cats = usePostCats()
  const [cat, setCat] = useState('All')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const featured = posts.find(p => p.featured) ?? posts[0]
  const rest = useMemo(
    () => posts.filter(p => p !== featured && (cat === 'All' || p.cat === cat)),
    [posts, cat, featured]
  )

  return (
    <>
      <PageHero
        label="Journal"
        title={<>What we learned <Em>building it</Em></>}
        sub={<>Field notes from live engagements: the decisions, the trade-offs, and
          the things we would do differently. Written by the people who did the work.</>}
      />

      {/* An editor can delete every post; the page should thin out rather
          than throw — and drop the whole band, not leave an empty one. */}
      {featured && (
        <section className="section" style={{ background: 'var(--bg-surface)', paddingBottom: '3.5rem' }}>
          <div className="container">
            <FeaturedPost post={featured} />
          </div>
        </section>
      )}

      <section ref={ref} className="section" style={{ background: 'var(--bg)', paddingTop: '3.5rem' }}>
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex flex-wrap">
              {cats.map(c => (
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
