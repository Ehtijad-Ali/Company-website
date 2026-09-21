import React from 'react'
import { motion } from 'framer-motion'

import Contact from '../components/sections/Contact'
import { ImagePlate } from '../components/ui/EditorialImage'
import { img, TEXTURE } from '../data/imagery'
import { SITE } from '../data/site'
import { mergeContact } from '../data/contact'
import { useContactContent } from '../hooks/useSiteContent'
import { iconFor } from '../lib/icons'
import { E, DUR, RISE } from '../lib/motion'

export default function ContactPage() {
  /* The same details the contact section lists further down, surfaced at
     the top of the page. Someone who only wants the email address should
     not have to scroll past a form to find it. */
  const { channels } = mergeContact(useContactContent(), SITE)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────
          The page previously redirected to the home page, so every
          "Start a project" link on the site quietly went nowhere
          useful. This is the page those ten links were promising. */}
      <section className="section pt-36 pb-0 relative"
        style={{ background: 'var(--bg)', overflow: 'hidden' }}>
        <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} />

        <div className="container relative" style={{ zIndex: 1 }}>
          <motion.div
            initial={{opacity: 0, y: RISE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{duration: DUR.reveal, ease: E }}
            className="pb-16"
          >
            <p className="eyebrow mb-4">
              <span style={{ color: 'var(--brand)' }}>01</span>
              <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>Contact
            </p>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--step-5)', fontWeight: 500,
              lineHeight: 1.05, letterSpacing: '-0.028em', color: 'var(--text-primary)',
              maxWidth: '18ch', textWrap: 'balance',
            }}>
              Start with a <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>conversation</em>
            </h1>

            <p className="section-sub mt-5 mb-10" style={{ maxWidth: '52ch' }}>
              Tell us what you are building and where you are stuck. You will get a real reply
              from someone who would work on it, not a sales sequence.
            </p>

            <div className="fact-strip">
              {channels.map(({ icon, label, value, href }) => {
                const Icon = iconFor(icon)
                const body = (
                  <>
                    <Icon aria-hidden="true" />
                    <span className="eyebrow">{label}</span>
                    <strong>{value}</strong>
                  </>
                )
                return href
                  ? <a key={label} href={href} className="tap">{body}</a>
                  : <div key={label}>{body}</div>
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <Contact />
    </>
  )
}
