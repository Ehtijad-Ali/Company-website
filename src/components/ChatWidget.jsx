import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, ArrowUp, Sparkles } from 'lucide-react'
import { useContact } from '../context/ContactContext'
import { OPENING_MESSAGE, CONTACT } from '../services/chatKnowledge'
import { probeAI, sendMessage } from '../services/chatClient'
import { E } from '../lib/motion'


/* Chips that do something other than ask a question. */
const ACTIONS = {
  'Open the contact form': 'contact',
  'Book a discovery call': 'contact',
  'Start a project': 'contact',
  'Message on WhatsApp': 'whatsapp',
  'See the portfolio': '/portfolio',
  'Browse the team': '/team',
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }}
        />
      ))}
    </div>
  )
}

function Bubble({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        style={{
          maxWidth: '85%',
          padding: '0.625rem 0.875rem',
          borderRadius: isUser ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
          background: isUser ? 'var(--brand)' : 'var(--bg-surface)',
          color: isUser ? 'var(--text-on-brand)' : 'var(--text-primary)',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const { openContact } = useContact()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([OPENING_MESSAGE])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [aiOn, setAiOn] = useState(false)

  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const panelRef = useRef(null)

  /* Ask the backend once whether real AI answers are available. */
  useEffect(() => { probeAI().then(setAiOn) }, [])

  /* Keep the newest message in view. */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  /* Escape closes; click outside closes. */
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    const onClick = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    // Deferred so the click that opened the panel doesn't immediately close it.
    const id = setTimeout(() => window.addEventListener('mousedown', onClick), 0)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const ask = useCallback(async text => {
    const question = text.trim()
    if (!question || busy) return

    const action = ACTIONS[question]
    if (action === 'contact') { setOpen(false); openContact(); return }
    if (action === 'whatsapp') { window.open(CONTACT.whatsapp, '_blank', 'noopener'); return }
    if (action?.startsWith('/')) { setOpen(false); window.location.href = action; return }

    const history = [...messages, { role: 'user', content: question }]
    setMessages(history)
    setInput('')
    setBusy(true)

    const reply = await sendMessage(history.filter(m => m.role !== 'system'))
    setMessages(m => [...m, { role: 'assistant', content: reply.content, chips: reply.chips }])
    setBusy(false)
  }, [messages, busy, openContact])

  const lastChips = !busy && messages[messages.length - 1]?.role === 'assistant'
    ? messages[messages.length - 1].chips ?? []
    : []

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Chat with CodeNode"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: E }}
            className="fixed flex flex-col"
            style={{
              bottom: 'calc(1.75rem + 54px + 0.75rem)',
              right: '1.75rem',
              width: 'min(380px, calc(100vw - 2.5rem))',
              height: 'min(540px, calc(100vh - 10rem))',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              boxShadow: 'var(--e-4)',
              zIndex: 9998,
              overflow: 'hidden',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg-surface)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', background: 'var(--brand)' }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--text-on-brand)' }} />
                </span>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
                    fontWeight: 500, lineHeight: 1.2, color: 'var(--text-primary)',
                  }}>
                    CodeNode assistant
                  </p>
                  <p className="eyebrow" style={{ fontSize: '0.625rem', letterSpacing: '0.14em' }}>
                    {aiOn ? 'Ask anything' : 'Common questions'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex items-center justify-center"
                style={{
                  width: 28, height: 28, borderRadius: 'var(--r-sm)',
                  border: '1px solid transparent', background: 'transparent',
                  color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transcript */}
            <div
              ref={scrollRef}
              className="flex-1 flex flex-col gap-3"
              style={{ padding: '1rem', overflowY: 'auto', overscrollBehavior: 'contain' }}
            >
              {messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)}
              {busy && (
                <div className="flex justify-start">
                  <div style={{
                    padding: '0.625rem 0.875rem', borderRadius: '12px 12px 12px 3px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  }}>
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies */}
            {lastChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 shrink-0" style={{ padding: '0 1rem 0.75rem' }}>
                {lastChips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => ask(chip)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--r-full)',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'border-color var(--dur) var(--ease), color var(--dur) var(--ease)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--brand)'
                      e.currentTarget.style.color = 'var(--brand)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={e => { e.preventDefault(); ask(input) }}
              className="flex items-end gap-2 shrink-0"
              style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid var(--border)' }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) }
                }}
                placeholder="Ask about services, pricing, timelines…"
                aria-label="Your message"
                className="input"
                style={{ resize: 'none', maxHeight: '5rem', padding: '0.625rem 0.75rem', fontSize: '0.875rem' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send message"
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 38, height: 38, borderRadius: 'var(--r-md)', border: 'none',
                  background: input.trim() && !busy ? 'var(--brand)' : 'var(--bg-surface)',
                  color: input.trim() && !busy ? 'var(--text-on-brand)' : 'var(--text-disabled)',
                  cursor: input.trim() && !busy ? 'pointer' : 'default',
                  transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease)',
                }}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className="fixed flex items-center justify-center"
        style={{
          bottom: '1.75rem', right: '1.75rem',
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--brand)', color: 'var(--text-on-brand)',
          border: 'none', cursor: 'pointer', zIndex: 9999,
          boxShadow: 'var(--e-3)',
          transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, background 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--e-4)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--e-3)'
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="open"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageSquare className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  )
}
