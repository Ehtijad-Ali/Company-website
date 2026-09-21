import { SITE, absUrl, organisationLd } from './site.js'
import { FAQS } from './faqs.js'

/**
 * Per-route <head> copy.
 *
 * Kept as a table rather than a <Seo> block inside each page: seventeen
 * routes means seventeen chances for a title to drift out of the voice the
 * rest of the site is written in, and a table can be read top to bottom to
 * check that they don't.
 *
 * Titles are written WITHOUT the site name — <Seo> appends it. Aim for
 * under 60 characters here and under 160 for a description; past that
 * search results truncate mid-sentence.
 *
 * Dynamic routes (a team member, a course) list a fallback only. The page
 * itself knows the entity and renders its own <Seo> over the top.
 */
export const ROUTE_META = {
  '/': {
    title: null, // the home page uses the full site title verbatim
    description: SITE.description,
    jsonLd: [
      organisationLd(),
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { '@id': `${SITE.url}/#organization` },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  },

  '/about': {
    title: 'About the studio',
    description:
      'A small senior team in Pakistan, founded in 2025. How we work, what we refuse to do, and who you would actually be working with.',
  },

  '/services': {
    title: 'Services',
    description:
      'Web and mobile development, AI and machine learning, UI/UX design, cloud and DevOps, security and performance — eight disciplines you can buy separately.',
  },

  '/portfolio': {
    title: 'Work',
    description:
      'Selected products we have designed and built across AI, SaaS, fintech, mobile and web3 — what each one had to solve and what it runs on.',
  },

  '/team': {
    title: 'The team',
    description:
      'Every specialist here can be hired directly, by the hour, for a sprint, or embedded in your team. Rates, availability and what each of them does.',
  },
  '/team/:slug': {
    title: 'Team member',
    description: 'Experience, rates and availability for a CodeNode specialist.',
  },

  '/courses': {
    title: 'Courses',
    description:
      'Twelve three-month mentored courses, from web development to AI, taught by people who do the work. Answer seven questions and we will tell you which three are yours.',
  },
  '/courses/:slug': {
    title: 'Course',
    description:
      'A three-month mentored course with a plan for every month, taught by someone who does the work for a living.',
  },

  '/blog': {
    title: 'Writing',
    description:
      'Notes on engineering, AI, design systems and performance from the people doing the work — including the decisions we would make differently now.',
  },

  '/contact': {
    title: 'Contact',
    description:
      'Tell us what you are building and we will tell you what it takes. A short discovery call, an honest scope, and a reply within one business day.',
    jsonLd: {
      '@type': 'ContactPage',
      url: absUrl('/contact'),
      about: organisationLd(),
    },
  },

  '/privacy':  { title: 'Privacy policy',  description: 'What we collect, why we collect it, how long we keep it, and how to ask us to delete it.' },
  '/terms':    { title: 'Terms of service', description: 'The terms that govern engagements with CodeNode, in plain language.' },
  '/cookies':  { title: 'Cookie policy',    description: 'Which cookies this site sets, what each one does, and how to turn them off.' },
  '/sitemap':  { title: 'Sitemap',          description: 'Every page on codenode.io in one list.' },

  /* Nothing below belongs in an index. */
  '/login':    { title: 'Sign in',        noindex: true },
  '/register': { title: 'Create account', noindex: true },
  '/admin':    { title: 'Admin',          noindex: true },
  '/404':      { title: 'Page not found', noindex: true },
}

/** Routes worth putting in front of a crawler, for public/sitemap.xml. */
export const INDEXABLE_PATHS = Object.entries(ROUTE_META)
  .filter(([path, meta]) => !meta.noindex && !path.includes(':'))
  .map(([path]) => path)
