import React from 'react'
import LegalLayout from '../components/LegalLayout'

const SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: [
      { type: 'p', text: 'By engaging CodeNode for any service, whether through our website, a signed proposal, or a verbal agreement, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind that entity.' },
      { type: 'highlight', text: 'These terms form part of every client engagement. Where a separate project agreement or Statement of Work (SoW) exists, that document takes precedence over any conflicting provision here.' },
    ],
  },
  {
    id: 'services',
    title: 'Services Description',
    content: [
      { type: 'p', text: 'CodeNode provides digital product design, software engineering, AI/ML development, mobile application development, cloud infrastructure, and digital growth services to clients worldwide.' },
      { type: 'list', items: [
        'All deliverables are defined in a written SoW or project proposal agreed prior to work commencing.',
        'We reserve the right to refuse or discontinue services that conflict with our ethical standards.',
        'Estimated timelines are good-faith projections. We communicate delays promptly and proactively.',
        'Services may be delivered remotely and across multiple time zones; we agree on communication windows at project kick-off.',
      ]},
    ],
  },
  {
    id: 'responsibilities',
    title: 'Client Responsibilities',
    content: [
      { type: 'p', text: 'A successful engagement is a two-way commitment. As a client, you agree to:' },
      { type: 'list', items: [
        'Provide timely feedback within agreed review windows (default: 5 business days per review cycle).',
        'Supply all required assets, credentials, and third-party access necessary for delivery.',
        'Designate a single primary point of contact for project decisions.',
        'Notify us promptly of any change in project scope, timeline constraints, or business priorities.',
        'Ensure all materials you provide are free of third-party IP infringement.',
      ]},
      { type: 'highlight', text: 'Delays caused by late client feedback, missing assets, or scope changes that were not communicated in advance may result in revised timelines and additional charges, which we will document and agree in writing before proceeding.' },
    ],
  },
  {
    id: 'payment',
    title: 'Payments & Billing',
    content: [
      { type: 'p', text: 'Our standard payment terms are outlined in each project proposal. Unless otherwise agreed:' },
      { type: 'list', items: [
        'A 50% deposit is required before work commences on any fixed-price project.',
        'Remaining balances are invoiced upon milestone completion or monthly, as specified in the SoW.',
        'Invoices are payable within 14 calendar days of issue.',
        'Late payments accrue interest at 2% per month from the due date.',
        'Retainer arrangements are invoiced on the 1st of each month, payable in advance.',
      ]},
      { type: 'p', text: 'All prices are exclusive of VAT or applicable sales tax, which will be added where required by law.' },
    ],
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    content: [
      { type: 'p', text: 'Upon receipt of final payment in full, you own everything we create specifically for you:' },
      { type: 'list', items: [
        'Custom source code, designs, and documentation produced exclusively for your project.',
        'All creative assets originated during the engagement that are not derived from third-party libraries.',
      ]},
      { type: 'p', text: 'We retain ownership of the following and grant you a perpetual licence to use them:' },
      { type: 'list', items: [
        'Pre-existing frameworks, libraries, and reusable components incorporated into your deliverables.',
        'Internal tooling, boilerplates, and methodologies developed outside your engagement.',
      ]},
      { type: 'highlight', text: 'We may include your project in our portfolio and case studies unless you notify us in writing that the work is confidential. We never disclose proprietary business information in public showcases.' },
    ],
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    content: [
      { type: 'p', text: 'Both parties agree to keep confidential all non-public information disclosed during the engagement, including business strategies, technical architectures, financial data, and customer information.' },
      { type: 'list', items: [
        'Confidentiality obligations survive termination of the engagement for a period of 3 years.',
        'We will not disclose confidential information except to team members and sub-contractors bound by equivalent obligations.',
        'Disclosure required by law or court order is permitted with reasonable prior notice to you where possible.',
      ]},
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: [
      { type: 'p', text: 'To the maximum extent permitted by applicable law:' },
      { type: 'list', items: [
        'Our total aggregate liability to you for any claim arising from or related to these terms or an engagement shall not exceed the total fees paid by you for the relevant project in the 12 months preceding the claim.',
        'We are not liable for indirect, consequential, incidental, or punitive damages, including lost profits, data loss, or business interruption, even if advised of the possibility of such damages.',
        'Nothing in these terms limits liability for fraud, wilful misconduct, or death/personal injury caused by negligence.',
      ]},
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    content: [
      { type: 'p', text: 'Either party may terminate an engagement with 14 days written notice. Upon termination:' },
      { type: 'list', items: [
        'You will be invoiced for all work completed and expenses incurred up to the termination date.',
        'We will deliver all completed work products to you upon receipt of outstanding payment.',
        'Deposits are non-refundable once work has commenced unless we are in material breach.',
      ]},
      { type: 'p', text: 'We may terminate immediately (without notice) if you engage in unlawful activity, fail to pay after a 21-day grace period, or breach confidentiality obligations.' },
    ],
  },
  {
    id: 'governing',
    title: 'Governing Law',
    content: [
      { type: 'p', text: 'These terms are governed by the laws of England and Wales. Any dispute arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.' },
      { type: 'p', text: 'For clients outside the UK, we are open to agreeing alternative governing jurisdictions in writing as part of the project agreement.' },
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalLayout
      badge="Terms of Service"
      number="02"
      title="How We Work Together"
      tagline="Clear, fair terms for every engagement. We keep things simple: you know exactly what to expect from us, and we know exactly what we need from you."
      updated="April 2026"
      sections={SECTIONS}
    />
  )
}
