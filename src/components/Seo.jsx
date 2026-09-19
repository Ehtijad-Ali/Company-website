import { useLayoutEffect } from 'react'
import { SITE, absUrl } from '../data/site'

/**
 * Per-route <head> management, without a dependency.
 *
 * The site is one HTML file for seventeen routes, so without this every
 * page shares index.html's single title and description — search engines
 * index them as duplicates of each other and every shared link previews
 * identically. react-helmet-async would do the same job; it would also add
 * a provider and a package for what is three DOM calls.
 *
 * Every tag written here is stamped `data-seo`, and the whole set is torn
 * down when the route unmounts, so two pages can never leave each other's
 * tags behind.
 *
 * Note this only reaches crawlers that execute JavaScript. Google does;
 * most social scrapers do not, so link previews will stay generic until
 * the site is prerendered or server-rendered.
 */

const MARK = 'data-seo'

function upsert(selector, create) {
  let el = document.head.querySelector(`${selector}[${MARK}]`)
  if (!el) {
    el = create()
    el.setAttribute(MARK, '')
    document.head.appendChild(el)
  }
  return el
}

const meta = (attr, key, content) => {
  if (!content) return
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  })
  el.setAttribute('content', content)
}

export default function Seo({
  title,
  description = SITE.description,
  path = typeof window !== 'undefined' ? window.location.pathname : '/',
  image = SITE.ogImage,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  /* Layout effect, not effect: the title should change in the same frame
     the new route paints, not one frame after it. */
  useLayoutEffect(() => {
    const full = title ? `${title} | ${SITE.name}` : SITE.title
    const url  = absUrl(path)
    const img  = image?.startsWith('http') ? image : absUrl(image)

    document.title = full

    meta('name', 'description', description)
    if (noindex) meta('name', 'robots', 'noindex, nofollow')

    meta('property', 'og:type', type)
    meta('property', 'og:site_name', SITE.name)
    meta('property', 'og:locale', SITE.locale)
    meta('property', 'og:title', full)
    meta('property', 'og:description', description)
    meta('property', 'og:url', url)
    meta('property', 'og:image', img)

    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:site', SITE.twitter)
    meta('name', 'twitter:title', full)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', img)

    const canonical = upsert('link[rel="canonical"]', () => {
      const l = document.createElement('link')
      l.rel = 'canonical'
      return l
    })
    canonical.href = url

    if (jsonLd) {
      const script = upsert('script[type="application/ld+json"]', () => {
        const s = document.createElement('script')
        s.type = 'application/ld+json'
        return s
      })
      script.textContent = JSON.stringify(
        Array.isArray(jsonLd)
          ? { '@context': 'https://schema.org', '@graph': jsonLd }
          : { '@context': 'https://schema.org', ...jsonLd }
      )
    }

    return () => {
      document.head.querySelectorAll(`[${MARK}]`).forEach(el => el.remove())
    }
    /* Structured data is compared by value: pages pass object literals,
       which are a new reference on every render. */
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)])

  return null
}
