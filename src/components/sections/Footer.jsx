import React, { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUp, ChevronDown, Send, Linkedin, Twitter, Github, Instagram, Dribbble } from 'lucide-react'
import CodeNodeLogo from '../CodeNodeLogo'

const NAV = {
  Company:  [['About',     '/about'],['Team','/team'],['Portfolio','/portfolio'],['Careers','/contact'],['Blog','/blog']],
  Services: [['Web Dev',   '/services'],['Mobile Apps','/services'],['UI/UX','/services'],['AI & ML','/services'],['Marketing','/services'],['Courses','/services#courses']],
  Legal:    [['Privacy',   '/privacy'],['Terms','/terms'],['Cookies','/cookies'],['Sitemap','/sitemap']],
}
const SOCIALS = [[Linkedin,'LinkedIn'],[Twitter,'Twitter'],[Github,'GitHub'],[Instagram,'Instagram'],[Dribbble,'Dribbble']]

/**
 * One footer link group.
 *
 * Below `lg` the three groups stacked into twenty-odd links of dead scroll
 * between the newsletter and the copyright, so on small screens each group
 * collapses behind its own heading and the whole footer fits a thumb's
 * reach. From `lg` the button stops responding (`pointer-events-none`) and
 * the list is forced open, so the desktop column layout is unchanged and
 * never depends on component state.
 */
function NavGroup({ title, links, open, onToggle }) {
  const listId = `footer-nav-${useId().replace(/:/g, '')}`
  return (
    <div className="border-b lg:border-b-0" style={{ borderColor: 'var(--border)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={listId}
        className="tap w-full flex items-center justify-between gap-4 py-4 lg:py-0 text-left lg:pointer-events-none lg:cursor-default"
      >
        {/* The heading carries the row on mobile, so it takes the ink there
            and drops back to a quiet label once it is a column head. */}
        <span className="font-mono text-[11px] lg:text-[10px] uppercase tracking-wider text-[color:var(--text-primary)] lg:text-[color:var(--text-secondary)]">
          {title}
        </span>
        <ChevronDown
          className="w-4 h-4 shrink-0 lg:hidden"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.25s ease',
          }}
        />
      </button>
      <ul
        id={listId}
        className={`${open ? 'block' : 'hidden'} lg:block space-y-2.5 lg:space-y-3 pb-5 lg:pb-0 lg:mt-5`}
      >
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="tap text-sm transition-colors hover:text-accent"
              style={{ color:'var(--text-secondary)' }}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const [email, setEmail]         = useState('')
  const [subscribed, setSubscribed] = useState(false)
  /* One panel at a time, all shut on arrival — the footer should read as a
     short list of headings before it reads as links. */
  const [openGroup, setOpenGroup] = useState(null)
  return (
    <footer className="relative pt-20 footer-fab-clear" style={{ background:'var(--bg)', borderTop:'1px solid var(--border)' }}>
      <div className="container relative z-10">
        {/* Footer grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="tap flex items-center mb-5 group" style={{ textDecoration: 'none' }}>
              <CodeNodeLogo height={28} />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color:'var(--text-secondary)' }}>
              Premium digital agency crafting extraordinary web experiences, AI solutions, and mobile applications for ambitious companies worldwide.
            </p>
            {/* Newsletter */}
            <p className="font-mono text-[10px] uppercase tracking-wider mb-3" style={{ color:'var(--text-secondary)' }}>Newsletter</p>
            {subscribed
              ? <p className="text-sm font-medium text-green-400">✓ Subscribed!</p>
              : (
                <form onSubmit={e=>{e.preventDefault();if(email){setSubscribed(true);setEmail('')}}} className="flex">
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
                    className="flex-1 px-4 py-2.5 rounded-l-xl text-sm"
                    style={{ background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text-primary)', outline:'none' }} />
                  <button type="submit" className="px-4 py-2.5 rounded-r-xl" style={{ background:'var(--primary)', color:'var(--primary-contrast)' }}>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
          </div>

          {/* Links — accordion rows on small screens, three columns from lg */}
          <div className="lg:col-span-3 grid lg:grid-cols-3 lg:gap-10 border-t lg:border-t-0"
            style={{ borderColor:'var(--border)' }}>
            {Object.entries(NAV).map(([title, links]) => (
              <NavGroup
                key={title}
                title={title}
                links={links}
                open={openGroup === title}
                onToggle={() => setOpenGroup(cur => (cur === title ? null : title))}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-8"
          style={{ borderTop:'1px solid var(--border)' }}>
          <p className="font-mono text-xs" style={{ color:'var(--text-secondary)' }}>
            © {new Date().getFullYear()} CodeNode. Crafted with ♥
          </p>
          <div className="flex gap-2">
            {SOCIALS.map(([Icon, label]) => (
              <motion.a key={label} href="#" title={label} whileHover={{ y:-3 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:border-accent"
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                <Icon className="w-3.5 h-3.5" style={{ color:'var(--text-secondary)' }} />
              </motion.a>
            ))}
          </div>
          <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
            className="tap flex items-center gap-2 font-mono text-xs transition-colors hover:text-accent"
            style={{ color:'var(--text-secondary)' }}>
            <ArrowUp className="w-3.5 h-3.5" />Back to top
          </button>
        </div>
      </div>

      {/* Brand watermark.
          Drawn as SVG text rather than a CSS-sized <span>: `textLength` makes
          the browser fit the word to the box exactly, so it spans the
          container edge to edge at every width instead of being guessed at
          with vw units and then clipped on narrow screens. `lengthAdjust
          ="spacing"` absorbs the difference in tracking only — the letter
          shapes are never stretched. The viewBox is cropped to the cap
          height so the word sits flush on the bottom of the page. */}
      <div className="container mt-12 select-none pointer-events-none">
        <svg
          viewBox="0 0 1000 132"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
          style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
        >
          <text
            x="500" y="128"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacing"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '178px',
              fontWeight: 500,
              fill: 'var(--text-primary)',
            }}
          >
            CODENODE
          </text>
        </svg>
      </div>
    </footer>
  )
}
