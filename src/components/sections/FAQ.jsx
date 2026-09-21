import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import { Plus, Minus } from 'lucide-react'
import { FAQS } from '../../data/faqs'
import { E, DUR, RISE } from '../../lib/motion'

/**
 * One question.
 *
 * No box around it: eight bordered cards stacked three apart read as eight
 * separate things, when the point of an FAQ is one list you scan. A rule
 * between neighbours does the same work with none of the weight.
 */
function Item({ q, a, i }) {
  const [open, setOpen] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-30px' })

  return (
    <motion.div ref={ref}
      initial={{opacity:0, y: RISE }} animate={inView?{opacity:1,y:0}:{}}
      transition={{delay:i*.06, duration: DUR.reveal, ease: E }}
      className="overflow-hidden"
      style={{ borderTop: i === 0 ? 'none' : '1px solid var(--divider)' }}
    >
      <button onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="tap w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-syne font-semibold text-base" style={{ color:'var(--text-primary)' }}>{q}</span>
        <div className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: open ? 'var(--primary)' : 'var(--bg)', border:`1px solid ${open ? 'transparent' : 'var(--border)'}` }}>
          {open
            ? <Minus className="w-3.5 h-3.5" style={{ color:'var(--primary-contrast)' }} />
            : <Plus  className="w-3.5 h-3.5" style={{ color:'var(--text-secondary)' }} />
          }
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }}
            animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:.3, ease: E }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color:'var(--text-secondary)', maxWidth: '68ch' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="faq" ref={ref} className="section" style={{ background:'var(--bg)' }}>
      <div className="container">

        <SectionHeader
          num="07"
          label="FAQ"
          title={[{ t: 'The questions we get ' }, { t: 'before every project', em: true }]}
          inView={inView}
          className="mb-4"
        />
        <p className="text-sm mb-12" style={{ color: 'var(--text-secondary)' }}>
          Still have questions?{' '}
          <Link to="/contact" className="tap underline underline-offset-2"
            style={{ color: 'var(--brand)', fontWeight: 500 }}>
            Let's talk
          </Link>
        </p>

        {/* ── Accordion ──
            The closing rule belongs to the list, not to the last question,
            so the stack reads as a finished block rather than trailing off. */}
        <div style={{ borderBottom: '1px solid var(--divider)' }}>
          {FAQS.map((item, i) => <Item key={item.q} {...item} i={i} />)}
        </div>

      </div>
    </section>
  )
}
