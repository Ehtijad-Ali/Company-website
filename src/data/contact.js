/**
 * Contact content — the contact section, the /contact page header, and the
 * options the enquiry form offers.
 *
 * The email, phone and office values live in data/site.js as well, because
 * <head>, the sitemap and structured data all need them at build time and
 * cannot wait for an API call. This document is what the *page* renders, so
 * editing it in the admin changes what a visitor sees immediately; the
 * build-time copy in site.js is the one to update on the next deploy.
 * `mergeContact()` below keeps them from silently disagreeing by filling
 * blanks here from site.js.
 *
 * Plain data only, no imports: serialised into the content API seed.
 * See data/team.js for the rule in full.
 */

export const CONTACT = {
  /** `icon` is a name from lib/icons.js. Empty `value` falls back to site.js. */
  channels: [
    { icon: 'Mail',   label: 'Email',    value: '', href: 'mailto:{email}' },
    { icon: 'Phone',  label: 'Phone',    value: '', href: '{phoneHref}' },
    { icon: 'MapPin', label: 'Office',   value: '' },
    { icon: 'Clock',  label: 'We reply', value: '' },
  ],

  socials: [
    { icon: 'Linkedin',  href: '#', label: 'LinkedIn'  },
    { icon: 'Twitter',   href: '#', label: 'Twitter'   },
    { icon: 'Github',    href: '#', label: 'GitHub'    },
    { icon: 'Instagram', href: '#', label: 'Instagram' },
  ],

  whatsapp: {
    enabled: true,
    href: 'https://wa.me/922554680662',
    label: 'Chat on WhatsApp',
    note: 'Available 24/7',
  },

  /** The scripted CLI panel beside the form. `delay` is seconds. */
  terminal: [
    { text: '$ codenode init --project',   color: 'var(--text-secondary)', delay: 0.5 },
    { text: '> Analysing requirements...', color: 'var(--accent)',         delay: 1.1 },
    { text: '> Assembling expert team...', color: 'var(--accent)',         delay: 1.7 },
    { text: '> Building your vision...',   color: 'var(--accent)',         delay: 2.3 },
    { text: '✓ Ready to launch!',          color: '#22C55E',               delay: 2.9 },
  ],

  form: {
    heading: 'Start a Conversation',
    /** Empty means "use the live service catalogue", so adding a service in
     *  the admin adds it to this dropdown without a second edit. */
    services: [],
    note: 'We respond within 24 hours. No spam, ever.',
    successTitle: 'Message Sent!',
    successBody: "We'll respond within 24 hours.",
  },
}

/**
 * Fill blank channel values and `{token}` hrefs from site.js.
 * Keeps one address from being right in <head> and stale on the page.
 */
export const mergeContact = (contact, site) => {
  const byLabel = {
    Email:      site.email,
    Phone:      site.phone,
    Office:     site.office,
    'We reply': site.replyTime,
  }
  const fill = s => (s || '')
    .replace('{email}', site.email)
    .replace('{phone}', site.phone)
    .replace('{phoneHref}', site.phoneHref)

  return {
    ...contact,
    channels: (contact.channels ?? []).map(c => ({
      ...c,
      value: c.value || byLabel[c.label] || '',
      href: c.href ? fill(c.href) : undefined,
    })),
  }
}
