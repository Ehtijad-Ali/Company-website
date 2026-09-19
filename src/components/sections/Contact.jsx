import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight, Linkedin, Twitter, Github, Instagram, Plus, Minus } from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import { useContact } from '../../context/ContactContext'
import SectionHeader from '../ui/SectionHeader'
import { ImagePlate } from '../ui/EditorialImage'
import { img, TEXTURE } from '../../data/imagery'
import { SITE } from '../../data/site'

/* Values come from data/site.js — the contact page lists the same three
   and they had already been typed out twice. */
const INFO = [
  { icon:Mail,    label:'Email',  value:SITE.email },
  { icon:Phone,   label:'Phone',  value:SITE.phone },
  { icon:MapPin,  label:'Office', value:SITE.office },
]
const SOCIALS = [
  { icon:Linkedin,  href:'#', label:'LinkedIn'  },
  { icon:Twitter,   href:'#', label:'Twitter'   },
  { icon:Github,    href:'#', label:'GitHub'    },
  { icon:Instagram, href:'#', label:'Instagram' },
]
const TERMINAL = [
  { text:'$ codenode init --project',     color:'var(--text-secondary)', delay:.5 },
  { text:'> Analysing requirements...',   color:'var(--accent)',          delay:1.1 },
  { text:'> Assembling expert team...',   color:'var(--accent)',          delay:1.7 },
  { text:'> Building your vision...',     color:'var(--accent)',          delay:2.3 },
  { text:'✓ Ready to launch!',            color:'#22C55E',               delay:2.9 },
]
const FAQS = [
  { q:'How long does a typical project take?',
    a:'It depends on scope. A focused landing page takes 2 to 3 weeks. A full SaaS platform typically runs 3 to 6 months. We always define clear milestones upfront so you know exactly what to expect.' },
  { q:'Do you work with early-stage startups or only enterprises?',
    a:'Both. We have flexible engagement models, from lean MVP sprints for startups to long-term retainers for enterprise teams. Budget range starts at $5,000 for targeted projects.' },
  { q:'What makes CodeNode different from other agencies?',
    a:'We\'re engineers who design and designers who understand code. No handoff chaos, no "waterfall" gaps. Every team member contributes to both vision and execution, which means faster delivery and fewer revisions.' },
  { q:'Can you take over an existing codebase?',
    a:'Yes, we\'ve rescued many projects. We start with a thorough audit, honest assessment, and a clear remediation plan before touching a single line of code.' },
  { q:'How do you handle post-launch support?',
    a:'Every project includes a 30-day warranty window. After that, we offer flexible monthly retainer plans for ongoing maintenance, feature development, and performance monitoring.' },
  { q:'How do you price projects?',
    a:'Fixed-price for well-scoped projects; time & materials for exploratory or evolving work. We\'ll recommend the model that best protects both sides after the discovery call.' },
]

function FaqItem({ q, a, i, inView }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ delay:.7+i*.06, duration:.5 }}
      className="rounded-xl overflow-hidden"
      style={{ border:`1px solid ${open?'var(--border-subtle)':'var(--border)'}`, background:'var(--bg-card)' }}
    >
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
        <span className="font-syne font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{q}</span>
        <div className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background:open?'var(--primary)':'var(--bg)', border:`1px solid ${open?'transparent':'var(--border)'}` }}>
          {open
            ? <Minus className="w-3 h-3" style={{ color:'var(--primary-contrast)' }} />
            : <Plus  className="w-3 h-3" style={{ color:'var(--text-secondary)' }} />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.28, ease:[.22,1,.36,1] }}
            className="overflow-hidden">
            <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Contact({ forceVisible = false }) {
  const ref       = useRef(null)
  const inViewRaw = useInView(ref, { once:true, margin:'-80px' })
  const inView    = forceVisible || inViewRaw
  const [form, setForm]     = useState({ name:'', email:'', service:'', message:'' })
  const [status, setStatus] = useState('idle')
  const [error, setError]   = useState('')
  const [warning, setWarning] = useState('')
  const { closeContact } = useContact()

  useEffect(() => {
    if (status === 'done') {
      // close modal after a short delay so user sees the success state
      const t = setTimeout(() => {
        try { closeContact() } catch (e) { /* ignore when not in modal */ }
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [status, closeContact])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setWarning('')
    setStatus('sending')
    // Client-side validation
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    if (!form.name || form.name.trim().length < 2) {
      setError('Please enter your name (min 2 characters).')
      setStatus('idle')
      return
    }
    if (!form.email || !isEmail(form.email)) {
      setError('Please enter a valid email address.')
      setStatus('idle')
      return
    }
    if (!form.service) {
      setError('Please select a service.')
      setStatus('idle')
      return
    }
    if (!form.message || form.message.trim().length < 10) {
      setError('Please enter a message (min 10 characters).')
      setStatus('idle')
      return
    }

    try {
      const result = await apiClient.contact.submit(form)
      if (result.warning) {
        setWarning(result.warning)
      }
      setStatus('done')
      setForm({ name:'', email:'', service:'', message:'' })
    } catch (err) {
      setError(err.message || 'Unable to send your message. Please try again later.')
      setStatus('error')
    }
  }

  const isFormValid = () => {
    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    return form.name.trim().length >= 2 && isEmail(form.email) && form.service && form.message.trim().length >= 10
  }

  /* The top divider is a real border rather than an absolutely positioned
     1px div, so it cannot stack with the one `.section + .section` draws
     when this sits after another section. */
  return (
    <section id="contact" ref={ref} className="section relative" style={{ background:'var(--bg-surface)', overflow:'hidden', borderTop:'1px solid var(--border)' }}>
      {/* Sandstone strata behind the contact block, at the same weight
          as the closing CTA so the two read as a pair. */}
      <ImagePlate src={img(TEXTURE.sandstone, 1600, 1000)} />
      <div className="container relative" style={{ zIndex: 1 }}>

        {/* Header. The outline-stroke number that used to sit on the right
            was the last survivor of a pattern removed everywhere else on the
            site: it reads as a template, and badly in a high-contrast serif. */}
        <SectionHeader
          label="Contact"
          title={[{ t: 'Tell us what ' }, { t: "you're building", em: true }]}
          subtitle="One form, one reply, from a person. No sales sequence and no chasing."
          inView={inView}
          className="mb-12"
        />

        {/* Contact grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">

          {/* Left */}
          <motion.div initial={{ opacity:0, x:-40 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:.7 }}
            className="space-y-7">
            {/* Terminal */}
            <div className="rounded-xl overflow-hidden" style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}>
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
                {['#EF4444','#F59E0B','#22C55E'].map(c=><div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background:c }}/>)}
                <span className="font-mono text-[10px] ml-2" style={{ color:'var(--text-secondary)' }}>codenode-cli</span>
              </div>
              <div className="p-5 space-y-2 min-h-[140px]">
                {TERMINAL.map(({ text, color, delay }, i) => (
                  <motion.p key={i} initial={{ opacity:0, x:-8 }} animate={inView?{opacity:1,x:0}:{}}
                    transition={{ delay, duration:.35 }}
                    className="font-mono text-sm" style={{ color }}>
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Info items */}
            <div className="space-y-3">
              {INFO.map(({ icon:Icon, label, value }, i) => (
                <motion.div key={label} initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:.4+i*.09 }}
                  className="card flex items-center gap-4 px-5 py-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background:'var(--bg-surface)', border:'1px solid var(--border)' }}>
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'var(--text-secondary)' }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{value}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                </motion.div>
              ))}
            </div>

            {/* WhatsApp */}
            <motion.a href="https://wa.me/922554680662" target="_blank" rel="noopener noreferrer"
              initial={{ opacity:0, y:14 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:.7 }}
              whileHover={{ scale:1.02 }} whileTap={{ scale:.98 }}
              className="btn flex items-center gap-3 w-full justify-center py-4 text-white font-semibold rounded-2xl"
              style={{ background:'linear-gradient(135deg,#25D366,#128C7E)', boxShadow:'0 6px 24px rgba(37,211,102,0.2)' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
              <span className="ml-auto text-sm opacity-70">Available 24/7</span>
            </motion.a>

            <div className="flex gap-2">
              {SOCIALS.map(({ icon:Icon, href, label }) => (
                <motion.a key={label} href={href} title={label}
                  initial={{ opacity:0, scale:0 }} animate={inView?{opacity:1,scale:1}:{}} transition={{ delay:.85, type:'spring', bounce:.5 }}
                  whileHover={{ y:-3 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                  <Icon className="w-4 h-4" style={{ color:'var(--text-secondary)' }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity:0, x:40 }} animate={inView?{opacity:1,x:0}:{}} transition={{ duration:.7 }}>
            <div className="card p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === 'done' ? (
                  <motion.div key="ok" initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }}
                    className="flex flex-col items-center justify-center py-14 text-center">
                    <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', bounce:.5, delay:.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.3)' }}>
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </motion.div>
                    <h3 className="font-syne font-bold text-xl mb-2" style={{ color:'var(--text-primary)' }}>Message Sent!</h3>
                    <p className="mb-8" style={{ color:'var(--text-secondary)' }}>We'll respond within 24 hours.</p>
                    <button onClick={()=>setStatus('idle')} className="btn btn-primary">Send Another</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} className="space-y-4">
                    {error && (
                      <div className="rounded-2xl p-4" style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)' }}>
                        <p className="text-sm" style={{ color:'var(--text-red)' }}>{error}</p>
                      </div>
                    )}
                    {warning && (
                      <div className="rounded-2xl p-4" style={{ background:'rgba(249,115,22,0.08)', border:'1px solid rgba(249,115,22,0.2)' }}>
                        <p className="text-sm" style={{ color:'var(--text-secondary)' }}>{warning}</p>
                      </div>
                    )}
                    <h3 className="font-syne font-bold text-xl mb-6" style={{ color:'var(--text-primary)' }}>Start a Conversation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input" type="text"   required placeholder="Your Name"       value={form.name}    onChange={set('name')} />
                      <input className="input" type="email"  required placeholder="Email Address"   value={form.email}   onChange={set('email')} />
                    </div>
                    <select className="input" required value={form.service} onChange={set('service')}>
                      <option value="" disabled>Select a service</option>
                      {['Web Development','Mobile Apps','UI/UX Design','AI & ML','Digital Marketing','Cloud & DevOps'].map(s=>(
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <textarea className="input resize-none" rows={5} required placeholder="Tell us about your project..."
                      value={form.message} onChange={set('message')} />
                    <motion.button type="submit" disabled={status==='sending'}
                      whileHover={{ scale:1.01 }} whileTap={{ scale:.98 }}
                      className="btn btn-primary w-full justify-center py-4">
                      {status === 'sending'
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                        : <><Send className="w-4 h-4" />Send Message</>}
                    </motion.button>
                    <p className="text-center font-mono text-[11px]" style={{ color:'var(--text-secondary)' }}>
                      We respond within 24 hours. No spam, ever.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:.4, duration:.6 }}
          style={{ borderTop:'1px solid var(--border)', paddingTop:'4rem' }}>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color:'var(--text-muted)' }}>/ FAQ</p>
              <h3 className="font-syne font-extrabold" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', color:'var(--text-primary)', letterSpacing:'-0.01em' }}>
                Common Questions
              </h3>
            </div>
            <span
              className="font-syne font-extrabold hidden lg:block"
              style={{ fontSize:'clamp(3rem,5vw,5rem)', lineHeight:1, color:'transparent',
                       WebkitTextStroke:'1px var(--ghost-stroke)', letterSpacing:'-0.04em', userSelect:'none' }}
            >FAQ</span>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {FAQS.map((item, i) => <FaqItem key={item.q} {...item} i={i} inView={inView} />)}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
