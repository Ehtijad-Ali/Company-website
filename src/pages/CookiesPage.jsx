import React from 'react'
import LegalLayout from '../components/LegalLayout'

const SECTIONS = [
  {
    id: 'what',
    title: 'What Are Cookies',
    content: [
      { type: 'p', text: 'Cookies are small text files placed on your device by websites you visit. They are widely used to make sites function correctly, remember your preferences, and provide information to site owners about how their site is used.' },
      { type: 'p', text: 'Cookies are not programs and cannot carry viruses or install software. They simply store a small amount of data, typically an identifier, that is sent back to the originating server on subsequent visits.' },
      { type: 'highlight', text: 'Our analytics provider is Plausible, a privacy-first, open-source tool that does not use cookies and does not track individuals across sites or devices. Most of our insight into site usage is therefore entirely cookie-free.' },
    ],
  },
  {
    id: 'types',
    title: 'Cookies We Use',
    content: [
      { type: 'p', text: 'We use a minimal set of cookies, each with a clear purpose:' },
      { type: 'list', items: [
        'Session cookies: temporary identifiers that expire when you close your browser, used to maintain your session state (e.g., form progress, theme preference).',
        'Preference cookies: remember choices you have made (such as dark/light mode) so you do not need to re-select them on return visits. These expire after 365 days.',
        'Security cookies: used to detect and prevent cross-site request forgery (CSRF) attacks. These are essential and cannot be disabled without degrading site security.',
      ]},
      { type: 'p', text: 'We do not use advertising cookies, cross-site tracking cookies, or social media tracking pixels on our main site.' },
    ],
  },
  {
    id: 'third-party',
    title: 'Third-Party Cookies',
    content: [
      { type: 'p', text: 'Certain third-party services embedded in our site may set their own cookies. We only integrate services that meet our privacy standards:' },
      { type: 'list', items: [
        'Stripe (payment processing): sets cookies during checkout flows to detect fraud and maintain payment session state. These are strictly necessary for the payment function to operate.',
        'YouTube / Vimeo embeds (where present): if we embed a video, those providers may set cookies when you interact with the player. We use privacy-enhanced embed URLs where available.',
        'Intercom or support chat widgets: may set session and identification cookies if our support chat is active on a page.',
      ]},
      { type: 'highlight', text: 'We regularly audit our third-party integrations and remove any that do not align with our cookie philosophy. If you notice a cookie we have not documented here, please let us know at privacy@codenode.io.' },
    ],
  },
  {
    id: 'managing',
    title: 'Managing Cookies',
    content: [
      { type: 'p', text: 'You have full control over cookies. Here is how to manage them:' },
      { type: 'list', items: [
        'Browser settings: all modern browsers let you view, block, or delete cookies. Find the option under Settings → Privacy or Security.',
        'Our cookie banner: when you first visit, you can accept only essential cookies or customise your preferences. You can change this at any time via the "Cookie Settings" link in our footer.',
        'Opt-out tools: for any third-party cookies from advertising networks (should they ever appear), you can use the IAB opt-out portal at optout.aboutads.info.',
      ]},
      { type: 'p', text: 'Blocking essential cookies may impair site functionality, particularly around form submissions and theme preferences. Non-essential cookies can be blocked without affecting core features.' },
    ],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    content: [
      { type: 'p', text: 'As our site evolves, the cookies we use may change. We will update this page whenever we add, modify, or remove cookies, and notify you via the cookie banner if material changes require fresh consent.' },
      { type: 'p', text: 'The "Last updated" date at the top of this page reflects the most recent revision. We recommend bookmarking this page if you want to stay current.' },
    ],
  },
]

export default function CookiesPage() {
  return (
    <LegalLayout
      badge="Cookie Policy"
      number="03"
      title="Cookies, Kept Simple"
      tagline="We use as few cookies as possible. Here is a complete, honest list of every cookie this site may set: what it does, how long it lasts, and how to disable it."
      updated="April 2026"
      sections={SECTIONS}
    />
  )
}
