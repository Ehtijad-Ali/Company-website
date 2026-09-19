/**
 * Team roster — the single source of truth for the home Team section, the
 * /team index, and each member's /team/:slug profile.
 *
 * ⚠️  PLACEHOLDER COMMERCIAL DATA
 * `rate`, `stats` (projects / rating / onTime / responseTime), `availability`,
 * and `portfolio` entries are invented for layout purposes. Replace them with
 * real figures before this goes in front of clients — a published hourly rate
 * is a commercial commitment, and invented ratings and client names are the
 * kind of thing that causes real problems.
 *
 * Sized for a studio founded in 2025: per-member project counts are in the
 * single and low double digits, and `years` is each person's own career
 * length, not their tenure here — two to five years across the roster.
 * Rates run $20–$50/hr. The whole team is based in Gilgit.
 *
 * `years` feeds METRICS.avgExperience in data/metrics.js; change one and
 * recompute the other.
 *
 * `img` uses Unsplash stock; swap for real headshots when you have them.
 */

/* Real headshots, committed to the repo rather than hotlinked, so a
   third-party image host going away cannot empty the team page. The
   remaining five members are still on stock and should be replaced. */
import ehtijadAli  from '../assets/team/ehtijad-ali.png'
import badarMuneem from '../assets/team/badar-muneem.jpg'
import almeenZahra from '../assets/team/almeen-zahra.jpg'
import failaAbbas  from '../assets/team/faila-abbas.png'

/** Availability drives the badge colour and the hire-card copy. */
export const AVAILABILITY = {
  available: { label: 'Available now',   tone: 'positive' },
  limited:   { label: 'Limited hours',   tone: 'caution'  },
  booked:    { label: 'Fully booked',    tone: 'muted'    },
}

export const DEPTS = ['All', 'Leadership', 'AI/ML', 'Design', 'Engineering', 'Marketing']

export const TEAM = [
  {
    slug: 'ehtijad-ali',
    name: 'Ehtijad Ali',
    role: 'Technical Director',
    dept: 'Leadership',
    img: ehtijadAli,
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 48,
    minEngagement: 'From 15 hours',
    availability: 'limited',
    hoursPerWeek: 15,
    tagline: 'Sets the technical direction and signs off the architecture on every build.',
    bio: 'Five years across web platforms and internal tooling, the last two of them leading teams. Sits in on the first call of every engagement so the architecture decisions get made before the code does, and stays close enough afterwards to catch the ones that age badly.',
    years: 5,
    skills: [
      { name: 'Technical Architecture', level: 5 },
      { name: 'Team Leadership',        level: 5 },
      { name: 'Web Platforms',          level: 4 },
      { name: 'Code Review',            level: 5 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Platform architecture review',   type: 'Architecture', blurb: 'Audited a three-year-old codebase and mapped a migration the team could ship in stages.', metric: 'Build times cut by half' },
      { title: 'Internal tooling consolidation', type: 'Engineering',  blurb: 'Replaced four overlapping admin tools with one service and a shared design system.', metric: '4 tools down to 1' },
    ],
    credentials: ['BS Computer Science', '5 years in software engineering'],
    stats: { projects: 12, rating: 4.9, onTime: 96, responseTime: 'within 3 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'badar-muneem',
    name: 'Badar Muneem',
    role: 'Backend Engineer',
    dept: 'Engineering',
    img: badarMuneem,
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 35,
    tagline: 'APIs and data models built to survive the second year, not just the launch.',
    bio: 'Four years on server-side work, mostly Node and Postgres behind products with real users. Writes the migration and the rollback before the feature, which has saved more than one launch weekend.',
    years: 4,
    skills: [
      { name: 'Node.js',        level: 5 },
      { name: 'PostgreSQL',     level: 5 },
      { name: 'API Design',     level: 4 },
      { name: 'Redis / Queues', level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }, { name: 'Punjabi', level: 'Native' }],
    portfolio: [
      { title: 'Booking system rebuild', type: 'Engineering', blurb: 'Replaced a fragile cron-driven flow with an event queue and idempotent handlers.', metric: 'Double bookings to zero' },
      { title: 'Reporting API',          type: 'Backend',     blurb: 'Pre-aggregated reporting layer so dashboards stopped querying production tables.', metric: 'Report loads under 400ms' },
    ],
    credentials: ['BS Software Engineering, UET Lahore', '4 years in backend engineering'],
    stats: { projects: 9, rating: 4.8, onTime: 95, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'sartaj-ali',
    name: 'Sartaj Ali',
    role: 'DevOps Engineer',
    dept: 'Engineering',
    img: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 38,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Pipelines, infrastructure and the monitoring that tells you before the client does.',
    bio: 'Four years keeping other teams\' deploys boring. Containers, CI and infrastructure as code, with a strong preference for the setup a two-person team can still operate at 2am without a runbook they have never read.',
    years: 4,
    skills: [
      { name: 'Docker / Kubernetes', level: 5 },
      { name: 'CI/CD Pipelines',     level: 5 },
      { name: 'Terraform',           level: 4 },
      { name: 'Observability',       level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Zero-downtime deploy pipeline', type: 'DevOps',         blurb: 'Blue-green releases with automated rollback on failed health checks.', metric: 'Monthly deploys became daily' },
      { title: 'Cloud cost cleanup',            type: 'Infrastructure', blurb: 'Right-sized instances and moved cold storage off hot disks.', metric: '41% lower monthly spend' },
    ],
    credentials: ['BS Information Technology, COMSATS', 'Certified Kubernetes Administrator'],
    stats: { projects: 11, rating: 4.9, onTime: 97, responseTime: 'within 2 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'almeen-zahra',
    name: 'Almeen Zahra',
    role: 'Product Designer',
    dept: 'Design',
    img: almeenZahra,
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 30,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 28,
    tagline: 'Interface work grounded in what the product actually has to do.',
    bio: 'Three years designing product surfaces for SaaS and marketplace teams. Starts from the edge cases rather than the happy path, on the theory that the empty state and the error message are where most products quietly lose people.',
    years: 3,
    skills: [
      { name: 'Product Design', level: 5 },
      { name: 'Design Systems', level: 4 },
      { name: 'Figma',          level: 5 },
      { name: 'Prototyping',    level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Dashboard redesign', type: 'Product Design', blurb: 'Cut a nine-item nav to four and rebuilt the default view around one job.', metric: 'Support tickets down 26%' },
      { title: 'Checkout flow',      type: 'UX',             blurb: 'Three-step flow with inline validation and a persistent order summary.', metric: '+19% completion' },
    ],
    credentials: ['BDes Communication Design, IVS Karachi', '3 years in product design'],
    stats: { projects: 8, rating: 4.9, onTime: 97, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'dribbble', url: '#' }],
  },
  {
    slug: 'faila-abbas',
    name: 'Faila Abbas',
    role: 'Frontend Engineer',
    dept: 'Engineering',
    img: failaAbbas,
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 32,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 32,
    tagline: 'React interfaces that stay accessible and fast on a mid-range phone.',
    bio: 'Four years turning design files into shipped interfaces. Tests on a throttled connection and a real device before calling anything done, and treats keyboard navigation as part of the build rather than a later fix.',
    years: 4,
    skills: [
      { name: 'React',            level: 5 },
      { name: 'TypeScript',       level: 4 },
      { name: 'CSS Architecture', level: 5 },
      { name: 'Accessibility',    level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }, { name: 'Punjabi', level: 'Native' }],
    portfolio: [
      { title: 'Marketing site rebuild', type: 'Frontend',    blurb: 'Static-first rebuild with route-level code splitting and real image budgets.', metric: 'Lighthouse 71 to 98' },
      { title: 'Component library',      type: 'Engineering', blurb: 'Thirty accessible components with documented props and visual tests.', metric: 'Adopted by 3 products' },
    ],
    credentials: ['BS Computer Science, PUCIT', '4 years in frontend engineering'],
    stats: { projects: 10, rating: 4.8, onTime: 96, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'zeeshan-karin',
    name: 'Zeeshan Karin',
    role: 'QA Engineer',
    dept: 'Engineering',
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 25,
    minEngagement: 'From 10 hours',
    availability: 'available',
    hoursPerWeek: 25,
    tagline: 'Finds the break before the client does, then writes the test that keeps it fixed.',
    bio: 'Two years in manual and automated testing across web and mobile releases. Good at asking the awkward questions early in a project, which is cheaper for everyone than finding the same answers during a release freeze.',
    years: 2,
    skills: [
      { name: 'Test Automation',      level: 4 },
      { name: 'Playwright / Cypress', level: 4 },
      { name: 'Regression Testing',   level: 5 },
      { name: 'Bug Triage',           level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Release regression suite', type: 'QA',             blurb: 'Automated the 120-case manual checklist down to a nine-minute CI run.', metric: 'Release prep cut by 2 days' },
      { title: 'Payments test coverage',   type: 'QA Engineering', blurb: 'End-to-end coverage across four payment providers and their failure modes.', metric: 'No payment defects in 6 releases' },
    ],
    credentials: ['BS Computer Science, SZABIST', 'ISTQB Foundation Level'],
    stats: { projects: 7, rating: 4.8, onTime: 98, responseTime: 'within 5 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'zeeshan-ali',
    name: 'Zeeshan Ali',
    role: 'Mobile Developer',
    dept: 'Engineering',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 20 hours',
    availability: 'limited',
    hoursPerWeek: 18,
    tagline: 'Cross-platform apps that feel native on both stores.',
    bio: 'Three years shipping React Native and Flutter apps, including two that went through the full store review and update cycle. Plans for offline use and flaky networks from the first sprint rather than patching them in later.',
    years: 3,
    skills: [
      { name: 'React Native',      level: 5 },
      { name: 'Flutter',           level: 4 },
      { name: 'Offline Sync',      level: 4 },
      { name: 'App Store Release', level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }, { name: 'Pashto', level: 'Conversational' }],
    portfolio: [
      { title: 'Field survey app',   type: 'Mobile', blurb: 'Offline-first data capture with conflict resolution on reconnect.', metric: 'Used by 200 field staff' },
      { title: 'Retail loyalty app', type: 'Mobile', blurb: 'Shared codebase across iOS and Android with native payment sheets.', metric: '4.6 average store rating' },
    ],
    credentials: ['BS Software Engineering, Air University', '3 years in mobile development'],
    stats: { projects: 8, rating: 4.7, onTime: 94, responseTime: 'within 6 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'kiran',
    name: 'Kiran',
    role: 'Content Strategist',
    dept: 'Marketing',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 22,
    minEngagement: 'From 10 hours',
    availability: 'available',
    hoursPerWeek: 20,
    tagline: 'Writes the words the product needs, not the words that fill the space.',
    bio: 'Three years in content strategy for technical products. Works from the interface outwards, which means the microcopy, the onboarding email and the landing page end up saying the same thing in the same voice.',
    years: 3,
    skills: [
      { name: 'Content Strategy',   level: 5 },
      { name: 'UX Writing',         level: 4 },
      { name: 'Editorial Planning', level: 4 },
      { name: 'SEO Content',        level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Onboarding rewrite', type: 'UX Writing', blurb: 'Rewrote twelve screens of setup copy around what the user was trying to finish.', metric: '+22% activation' },
      { title: 'Editorial system',   type: 'Content',    blurb: 'Voice guide, topic calendar and a brief template the whole team could use.', metric: '3 posts a week, sustained' },
    ],
    credentials: ['BA English Literature, GCU Lahore', '3 years in content strategy'],
    stats: { projects: 9, rating: 4.9, onTime: 98, responseTime: 'within 6 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'twitter', url: '#' }],
  },
  {
    slug: 'faiza-rehmat',
    name: 'Faiza Rehmat',
    role: 'Data Engineer',
    dept: 'AI/ML',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 38,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Builds the pipelines the models and the dashboards both depend on.',
    bio: 'Five years moving data between systems without losing it. Warehouses, ingestion and the tests that catch a broken upstream feed on the morning it breaks rather than at the end of the quarter.',
    years: 5,
    skills: [
      { name: 'Python',           level: 5 },
      { name: 'Airflow / dbt',    level: 4 },
      { name: 'Data Warehousing', level: 5 },
      { name: 'SQL',              level: 5 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Analytics warehouse',   type: 'Data Engineering', blurb: 'Consolidated six sources into one modelled warehouse with tested transforms.', metric: 'One source of truth across 6 systems' },
      { title: 'Ingestion reliability', type: 'Data Platform',    blurb: 'Freshness and volume checks with alerting on every upstream feed.', metric: 'Silent failures down to zero' },
    ],
    credentials: ['MS Computer Science, NUST', '5 years in data engineering'],
    stats: { projects: 10, rating: 4.9, onTime: 97, responseTime: 'within 3 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
]

export const getMember = slug => TEAM.find(m => m.slug === slug)

/** Same department first, then anyone — used for "others you might work with". */
export const getRelated = (slug, count = 3) => {
  const me = getMember(slug)
  if (!me) return []
  const sameDept = TEAM.filter(m => m.slug !== slug && m.dept === me.dept)
  const rest = TEAM.filter(m => m.slug !== slug && m.dept !== me.dept)
  return [...sameDept, ...rest].slice(0, count)
}

export const formatRate = rate => `$${rate}`
