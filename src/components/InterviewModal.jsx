import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '../services/apiClient'
import { formatRate } from '../data/team'

const ENGAGEMENTS = ['One-off consultation', 'Short project (< 1 month)', 'Ongoing project', 'Retainer / embedded']
const BUDGETS = ['Under $5k', '$5k to $15k', '$15k to $50k', '$50k+', 'Not sure yet']

const FIELD_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: '0.4rem',
}

/**
 * Interview request for one specific member.
 *
 * Submits to /api/interview, which persists the request even when SMTP is
 * unconfigured. If the backend is unreachable entirely (static deploy with no
 * server), the form says so and offers a mailto so the enquiry isn't lost.
 */
export default function InterviewModal({ member, open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', engagement: ENGAGEMENTS[0], budget: BUDGETS[1], message: '' })
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const firstFieldRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setState('idle')
    setError('')
    setForm(f => ({
      ...f,
      message: `Hi ${member.name.split(' ')[0]}, I'd like to talk about `,
    }))
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120)
    return () => clearTimeout(t)
  }, [open, member])

  /* Lock the page behind the modal, and restore on close. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (state === 'sending') return

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Name, email and a short message are required.')
      setState('error')
      return
    }

    setState('sending')
    setError('')
    try {
      await apiClient.interview.submit({
        member_slug: member.slug,
        member_name: member.name,
        ...form,
      })
      setState('sent')
    } catch (err) {
      setError(
        err?.message?.includes('Failed to fetch')
          ? "We couldn't reach the server. Email us directly and we'll pick it up."
          : err?.message || 'Something went wrong. Please try again.'
      )
      setState('error')
    }
  }

  if (!open) return null

  const mailto = `mailto:hello@codenode.dev?subject=${encodeURIComponent(
    `Interview request for ${member.name}`
  )}&body=${encodeURIComponent(form.message)}`

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onMouseDown={e => { if (!panelRef.current?.contains(e.target)) onClose() }}
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: 'rgba(27,20,18,0.55)', backdropFilter: 'blur(4px)', zIndex: 10000, padding: '1.25rem' }}
      >
        <motion.div
          ref={panelRef}
          role="dialog" aria-modal="true" aria-label={`Request an interview with ${member.name}`}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 'min(560px, 100%)', maxHeight: 'calc(100vh - 2.5rem)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', boxShadow: 'var(--e-4)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          {/* Header — who you're actually contacting */}
          <div className="flex items-center gap-3 shrink-0"
            style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
            <img
              src={member.img} alt="" className="member-photo"
              style={{ width: 40, height: 40, borderRadius: 'var(--r-sm)', objectFit: 'cover', objectPosition: 'top' }}
            />
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.2, color: 'var(--text-primary)' }}>
                Interview {member.name.split(' ')[0]}
              </p>
              <p className="eyebrow" style={{ letterSpacing: '0.12em' }}>
                {member.role} · {formatRate(member.rate)}/hr
              </p>
            </div>
            <button onClick={onClose} aria-label="Close"
              style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {state === 'sent' ? (
            <div className="flex flex-col items-center text-center" style={{ padding: '3rem 2rem' }}>
              <div className="flex items-center justify-center"
                style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--brand)', marginBottom: '1.25rem' }}>
                <Check className="w-6 h-6" style={{ color: 'var(--text-on-brand)' }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--step-2)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Request sent
              </h3>
              <p className="section-sub" style={{ fontSize: '0.9375rem', maxWidth: '34ch' }}>
                We'll come back to you about {member.name.split(' ')[0]}'s availability,
                normally {member.stats.responseTime}.
              </p>
              <button onClick={onClose} className="btn btn-secondary" style={{ marginTop: '1.75rem' }}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4"
              style={{ padding: '1.25rem', overflowY: 'auto' }}>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="iv-name" style={FIELD_LABEL}>Your name *</label>
                  <input id="iv-name" ref={firstFieldRef} className="input" value={form.name}
                    onChange={set('name')} placeholder="Jane Doe" autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="iv-email" style={FIELD_LABEL}>Email *</label>
                  <input id="iv-email" className="input" type="email" value={form.email}
                    onChange={set('email')} placeholder="jane@company.com" autoComplete="email" />
                </div>
              </div>

              <div>
                <label htmlFor="iv-company" style={FIELD_LABEL}>Company</label>
                <input id="iv-company" className="input" value={form.company}
                  onChange={set('company')} placeholder="Optional" autoComplete="organization" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="iv-engagement" style={FIELD_LABEL}>Engagement type</label>
                  <select id="iv-engagement" className="input" value={form.engagement} onChange={set('engagement')}>
                    {ENGAGEMENTS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="iv-budget" style={FIELD_LABEL}>Budget range</label>
                  <select id="iv-budget" className="input" value={form.budget} onChange={set('budget')}>
                    {BUDGETS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="iv-message" style={FIELD_LABEL}>What do you need? *</label>
                <textarea id="iv-message" className="input" rows={4} value={form.message}
                  onChange={set('message')} style={{ resize: 'vertical', minHeight: '6rem' }}
                  placeholder="A couple of lines about the work and the timeline." />
              </div>

              {state === 'error' && (
                <div className="flex items-start gap-2.5" style={{
                  padding: '0.75rem 0.875rem', borderRadius: 'var(--r-md)',
                  background: 'var(--terracotta-50)', border: '1px solid var(--terracotta-200)',
                }}>
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--terracotta-600)', marginTop: 2 }} />
                  <div style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: 'var(--terracotta-700)' }}>
                    {error}{' '}
                    <a href={mailto} style={{ textDecoration: 'underline', fontWeight: 500 }}>Email instead</a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3" style={{ marginTop: '0.25rem' }}>
                <button type="submit" className="btn btn-primary" disabled={state === 'sending'}
                  style={{ opacity: state === 'sending' ? 0.7 : 1 }}>
                  {state === 'sending'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    : 'Send request'}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  No obligation. We'll confirm availability first.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
