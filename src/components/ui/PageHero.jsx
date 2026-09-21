import React from 'react'
import { motion } from 'framer-motion'
import { ImagePlate } from './EditorialImage'
import { img, TEXTURE } from '../../data/imagery'
import { E } from '../../lib/motion'

/**
 * The opener every inner page shares, lifted from the Contact page so the
 * two cannot drift: the stucco plate, the numbered eyebrow, the display
 * headline and its standfirst, in a section of its own. The page's actual
 * content — a grid, a list, a filter bar — starts in the section after it,
 * not underneath the headline in the same block.
 *
 * `title` is a node so the italic turn of each headline stays in the page
 * that owns the copy. `children` sits under the standfirst, for the odd page
 * that carries something up front (Contact's channel strip).
 */
export default function PageHero({ num = '01', label, title, sub, children }) {
  return (
    <section className="section pt-36 pb-0 relative"
      style={{ background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Always above the fold, so it loads eagerly rather than popping in. */}
      <ImagePlate src={img(TEXTURE.stucco, 1600, 900)} eager />

      <div className="container relative" style={{ zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: E }}
          className="pb-16"
        >
          <p className="eyebrow mb-4">
            <span style={{ color: 'var(--brand)' }}>{num}</span>
            <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>/</span>{label}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--step-5)', fontWeight: 500,
            lineHeight: 1.05, letterSpacing: '-0.028em', color: 'var(--text-primary)',
            maxWidth: '18ch', textWrap: 'balance',
          }}>
            {title}
          </h1>

          {sub && (
            <p className={`section-sub mt-5${children ? ' mb-10' : ''}`} style={{ maxWidth: '52ch' }}>
              {sub}
            </p>
          )}

          {children}
        </motion.div>
      </div>
    </section>
  )
}

/* The brand-coloured italic every headline turns on. */
export const Em = ({ children }) => (
  <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--brand)' }}>{children}</em>
)
