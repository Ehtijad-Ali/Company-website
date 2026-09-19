/**
 * Site-level facts.
 *
 * Everything here ends up in <head>, in structured data, or in the XML
 * sitemap, so it is the one place to change a name, an address or a
 * handle rather than hunting through seventeen pages.
 *
 * ⚠️  `url` must match the domain the site is actually served from — it is
 * what canonical links, Open Graph tags and public/sitemap.xml all point
 * at, and a wrong value there is worse than no value at all. Set
 * VITE_SITE_URL at build time to override it per environment.
 */
const RAW_URL = import.meta.env?.VITE_SITE_URL || 'https://codenode.io'

export const SITE = {
  name: 'CodeNode',
  /** No trailing slash: every path is joined as `${url}${path}`. */
  url: RAW_URL.replace(/\/+$/, ''),
  tagline: 'Digital product studio',
  title: 'CodeNode | Digital Product Studio',
  description:
    'CodeNode is a Pakistan-based digital product studio. We design and build AI-driven platforms, enterprise web applications and mobile products, and we mentor the next set of engineers.',
  email: 'hello@codenode.io',
  phone: '+92 355 4680662',
  /** Dialable form of `phone` — digits only, for tel: links. */
  phoneHref: 'tel:+923554680662',
  office: 'Gilgit Baltistan, Pakistan',
  replyTime: 'Within one business day',
  founded: '2025',
  country: 'PK',
  locale: 'en_US',
  /** 1200×630. Drop the file in /public and social previews start working. */
  ogImage: '/og-image.png',
  twitter: '@codenode',
}

/** Absolute URL for a route path, for canonicals and structured data. */
export const absUrl = (path = '/') =>
  `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

/**
 * The organisation itself, as search engines want it described. Shared by
 * the static block in index.html and anything that needs a publisher.
 */
export const organisationLd = () => ({
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  foundingDate: SITE.founded,
  description: SITE.description,
  address: { '@type': 'PostalAddress', addressCountry: SITE.country },
})
