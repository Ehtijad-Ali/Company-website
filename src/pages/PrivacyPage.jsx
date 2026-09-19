import React from 'react'
import LegalLayout from '../components/LegalLayout'

const SECTIONS = [
  {
    id: 'collection',
    title: 'Information We Collect',
    content: [
      { type: 'p', text: 'We collect only what is necessary to deliver our services and improve your experience. This falls into two categories: information you provide directly, and information collected automatically.' },
      { type: 'list', items: [
        'Contact details submitted via our forms: name, email address, company, and project description.',
        'Communication records: emails, meeting notes, and feedback shared during a project engagement.',
        'Usage data automatically gathered when you visit our site: page views, referral source, session duration.',
        'Device identifiers: browser type, operating system, and anonymised IP address for security and performance logging.',
      ]},
      { type: 'highlight', text: 'We do not purchase third-party data lists and never collect sensitive categories of personal data (health information, financial credentials) unless explicitly provided as part of a project brief.' },
    ],
  },
  {
    id: 'usage',
    title: 'How We Use Your Data',
    content: [
      { type: 'p', text: 'Every piece of data we hold has a specific, documented purpose. We process your information under the following legal bases:' },
      { type: 'list', items: [
        'Contract performance: to scope, deliver, and invoice for the services you engaged us for.',
        'Legitimate interests: to improve our website and personalise outreach in a proportionate way.',
        'Consent: for newsletter subscriptions and non-essential cookies, where you have opted in.',
        'Legal obligation: to retain financial records as required by applicable tax and accounting law.',
      ]},
      { type: 'p', text: 'We do not use your data for automated decision-making or profiling that produces legal or similarly significant effects.' },
    ],
  },
  {
    id: 'sharing',
    title: 'Third-Party Sharing',
    content: [
      { type: 'p', text: 'We share data only with parties that directly support the delivery of our services, and only to the minimum extent required.' },
      { type: 'list', items: [
        'Cloud infrastructure (AWS, Vercel) for hosting and deployment under strict data processing agreements.',
        'Project tooling (Linear, Notion, Slack): each assessed for GDPR compliance before integration.',
        'Payment processing (Stripe): transaction data is handled under their own PCI-DSS compliance framework.',
        'Analytics (Plausible): a privacy-first, cookie-free tool that produces only aggregated statistics.',
      ]},
      { type: 'highlight', text: 'We never sell, rent, or trade your personal information. Any sub-processor we engage is contractually bound to handle data in accordance with GDPR and equivalent regulations.' },
    ],
  },
  {
    id: 'retention',
    title: 'Data Retention',
    content: [
      { type: 'p', text: 'We keep your data only for as long as needed for the purpose it was collected.' },
      { type: 'list', items: [
        'Project and contact records: 7 years post-project for legal and accounting compliance.',
        'Marketing communications: until you unsubscribe or withdraw consent.',
        'Website analytics: aggregated data retained indefinitely; session logs purged after 90 days.',
        'Job applications: 12 months, then securely deleted unless you consent to longer retention.',
      ]},
    ],
  },
  {
    id: 'rights',
    title: 'Your Rights',
    content: [
      { type: 'p', text: 'Depending on your jurisdiction (GDPR for EU/EEA residents, CCPA for California residents), you have the following rights:' },
      { type: 'list', items: [
        'Access: request a full copy of the data we hold about you.',
        'Rectification: ask us to correct inaccurate or incomplete data.',
        'Erasure: request deletion where no legal obligation requires us to retain it.',
        'Portability: receive your data in a structured, machine-readable format.',
        'Objection: opt out of processing based on legitimate interests or direct marketing.',
        'Restriction: ask us to pause processing while a dispute is resolved.',
      ]},
      { type: 'p', text: 'To exercise any right, email us at legal@codenode.io. We respond within 30 days.' },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    content: [
      { type: 'p', text: 'We treat data security as a core discipline, not a checkbox.' },
      { type: 'list', items: [
        'TLS 1.3 encryption for all data in transit.',
        'AES-256 encryption for data at rest on cloud storage.',
        'Role-based access control limiting exposure to authorised personnel only.',
        'Regular internal audits and penetration testing against OWASP Top 10.',
        'Incident response plan with a defined 72-hour notification window.',
      ]},
      { type: 'highlight', text: 'In the unlikely event of a breach affecting your data, we will notify you promptly, explain what happened, and detail every remediation step we are taking.' },
    ],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    content: [
      { type: 'p', text: 'We may revise this Privacy Policy to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will update the date above and notify active clients by email where appropriate.' },
      { type: 'p', text: 'Continued use of our services after a policy update constitutes acceptance of the revised terms.' },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      badge="Privacy Policy"
      number="01"
      title="Your Privacy, Our Responsibility"
      tagline="We believe in radical transparency about how we handle your data. This policy explains what we collect, why we collect it, and the controls you have over it, in plain language, no legalese."
      updated="April 2026"
      sections={SECTIONS}
    />
  )
}
