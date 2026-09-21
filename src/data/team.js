/**
 * Team roster — the single source of truth for the home Team section, the
 * /team index, and each member's /team/:slug profile.
 *
 * Names, roles and departments are real. Everything commercial around them
 * is not:
 *
 * ⚠️  PLACEHOLDER COMMERCIAL DATA
 * `rate`, `stats` (projects / rating / onTime / responseTime), `availability`,
 * `credentials` and `portfolio` entries are invented for layout purposes.
 * Replace them with real figures before this goes in front of clients — a
 * published hourly rate is a commercial commitment, and invented ratings and
 * client names are the kind of thing that causes real problems.
 *
 * Sized for a studio founded in 2025: per-member project counts are in the
 * single and low double digits, and `years` is each person's own career
 * length, not their tenure here — three to five years across the roster.
 * Rates run $20–$50/hr. The whole team is based in Gilgit.
 *
 * `years` feeds METRICS.avgExperience in data/metrics.js and the roster
 * length feeds TEAM_SIZE there; change one and recompute the others.
 *
 * Slugs are referenced by `mentor` in data/courses.js and by `author` in
 * BlogPage, so grep for a slug before renaming it — nothing else will warn.
 *
 * This module is the *fallback* copy of the roster. At runtime the site reads
 * /api/content/team and only falls back to what is bundled here when the API
 * cannot be reached — see services/content.js. Keep every record plain data:
 * no imports, no functions, nothing a bundler has to resolve, because
 * scripts/export-content.mjs serialises this straight into the database seed.
 *
 * Headshots are served from /public/team rather than imported, so a record
 * survives the round trip through the API unchanged.
 */

/** Availability drives the badge colour and the hire-card copy. */
export const AVAILABILITY = {
  available: { label: 'Available now',   tone: 'positive' },
  limited:   { label: 'Limited hours',   tone: 'caution'  },
  booked:    { label: 'Fully booked',    tone: 'muted'    },
}

export const DEPTS = ['All', 'Leadership', 'AI/ML', 'Engineering', 'Design', 'Product', 'Operations']

export const TEAM = [
  {
    slug: 'ehtijad-ali',
    name: 'Ehtijad Ali',
    role: 'Founder & Full-Stack AI Engineer',
    dept: 'Leadership',
    img: '/team/ehtijad-ali.png',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 50,
    minEngagement: 'From 15 hours',
    availability: 'limited',
    hoursPerWeek: 15,
    tagline: 'Founded the studio, and still writes the code on the hard parts of every build.',
    bio: 'Five years across web platforms and applied AI, the last two of them running this team. Works end to end — the model, the service around it and the interface on top — which is why the architecture decisions get made on the first call rather than discovered halfway through the build.',
    years: 5,
    skills: [
      { name: 'Full-Stack Engineering', level: 5 },
      { name: 'LLM & RAG Systems',      level: 5 },
      { name: 'Technical Architecture', level: 5 },
      { name: 'Team Leadership',        level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'RAG assistant for a support desk', type: 'AI Engineering', blurb: 'Retrieval over four years of tickets and docs, with a citation on every answer.', metric: 'First-response time cut by half' },
      { title: 'Internal tooling consolidation',   type: 'Engineering',    blurb: 'Replaced four overlapping admin tools with one service and a shared design system.', metric: '4 tools down to 1' },
    ],
    credentials: ['BS Computer Science', '5 years in software and AI engineering'],
    stats: { projects: 14, rating: 4.9, onTime: 96, responseTime: 'within 3 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'almeen-zahra',
    name: 'Almeen Zahra',
    role: 'AI & ML Engineer',
    dept: 'AI/ML',
    img: '/team/almeen-zahra.jpg',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 40,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Takes models out of the notebook and puts them behind an endpoint that stays up.',
    bio: 'Three years building and shipping machine learning systems, mostly NLP and recommendation work. Starts from the evaluation set rather than the model, on the theory that a team which cannot measure a result cannot tell whether it improved one.',
    years: 3,
    skills: [
      { name: 'PyTorch',            level: 5 },
      { name: 'NLP & Transformers', level: 4 },
      { name: 'Model Deployment',   level: 4 },
      { name: 'Evaluation & Evals', level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Document classification pipeline', type: 'Machine Learning', blurb: 'Fine-tuned a small transformer to route incoming paperwork by type and urgency.', metric: '94% routing accuracy' },
      { title: 'Recommendation service',           type: 'ML Engineering',   blurb: 'Replaced a hand-written rules engine with a trained ranker behind a cached API.', metric: '+17% click-through' },
    ],
    credentials: ['BS Computer Science', '3 years in AI and ML engineering'],
    stats: { projects: 8, rating: 4.9, onTime: 97, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'badar-muneem',
    name: 'Badar Muneem',
    role: 'Product & UI/UX Designer',
    dept: 'Design',
    img: '/team/badar-muneem.jpg',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Interface work grounded in what the product actually has to do.',
    bio: 'Four years designing product surfaces for SaaS and marketplace teams. Starts from the edge cases rather than the happy path, on the theory that the empty state and the error message are where most products quietly lose people.',
    years: 4,
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
    credentials: ['BDes Communication Design', '4 years in product and interface design'],
    stats: { projects: 11, rating: 4.9, onTime: 97, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'dribbble', url: '#' }],
  },
  {
    slug: 'zeeshan-karim',
    name: 'Zeeshan Karim',
    role: 'Product & Growth Manager',
    dept: 'Product',
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 10 hours',
    availability: 'available',
    hoursPerWeek: 25,
    tagline: 'Decides what gets built next, and can show you the numbers behind the decision.',
    bio: 'Four years between product and growth, close enough to both to keep them arguing productively. Runs the discovery calls, writes the scope everyone signs off on, and holds the roadmap to the handful of metrics that actually move the business.',
    years: 4,
    skills: [
      { name: 'Product Strategy',   level: 5 },
      { name: 'Growth Experiments', level: 4 },
      { name: 'Analytics',          level: 4 },
      { name: 'Roadmapping',        level: 5 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Activation programme', type: 'Growth',  blurb: 'Instrumented the funnel end to end, then ran six weeks of onboarding experiments against it.', metric: '+22% activation' },
      { title: 'Roadmap reset',        type: 'Product', blurb: 'Cut a 40-item backlog to a quarter with three outcomes and a measure for each.', metric: 'Shipped 3 of 3 on time' },
    ],
    credentials: ['BBA', '4 years in product and growth'],
    stats: { projects: 10, rating: 4.8, onTime: 96, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'twitter', url: '#' }],
  },
  {
    slug: 'faila-abbas',
    name: 'Faila Abbas',
    role: 'Data Scientist',
    dept: 'AI/ML',
    img: '/team/faila-abbas.png',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 38,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 32,
    tagline: 'Answers the question the business asked, not the one the data was easiest to ask.',
    bio: 'Four years in analysis and modelling across product and operations data. Spends the first week on where the numbers come from and what they leave out, which is usually the difference between a model that survives contact with production and one that does not.',
    years: 4,
    skills: [
      { name: 'Python & pandas',       level: 5 },
      { name: 'Statistical Modelling', level: 4 },
      { name: 'SQL',                   level: 5 },
      { name: 'Experiment Design',     level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Churn model',      type: 'Data Science', blurb: 'Predicted at-risk accounts a month out and handed sales a ranked weekly list.', metric: '31% of flagged accounts saved' },
      { title: 'Pricing analysis', type: 'Analytics',    blurb: 'Segmented two years of orders to find where discounting was buying nothing.', metric: 'Margin up 4 points' },
    ],
    credentials: ['BS Data Science', '4 years in analytics and data science'],
    stats: { projects: 10, rating: 4.8, onTime: 96, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'sartaj-ali',
    name: 'Sartaj Ali',
    role: 'AI Engineer',
    dept: 'AI/ML',
    img: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 38,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Builds the LLM features that hold up once real users start typing into them.',
    bio: 'Three years on applied AI work: retrieval, agents and the unglamorous plumbing around them. Strong preference for the setup a two-person team can still operate at 2am, which shapes the monitoring as much as the model layer.',
    years: 3,
    skills: [
      { name: 'LLM Applications',    level: 5 },
      { name: 'Vector Search / RAG', level: 4 },
      { name: 'Python',              level: 5 },
      { name: 'MLOps & Deployment',  level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Agentic back-office workflow', type: 'AI Engineering', blurb: 'Tool-using agent that drafts and files routine paperwork with a human approving each batch.', metric: 'Manual handling down 60%' },
      { title: 'Inference cost cleanup',       type: 'MLOps',          blurb: 'Routed easy requests to a smaller model and cached the repeat ones.', metric: '41% lower monthly spend' },
    ],
    credentials: ['BS Information Technology', '3 years in AI engineering'],
    stats: { projects: 9, rating: 4.9, onTime: 97, responseTime: 'within 2 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'hasnain-khush',
    name: 'Hasnain Khush',
    role: 'Full-Stack Developer',
    dept: 'Engineering',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 20 hours',
    availability: 'available',
    hoursPerWeek: 35,
    tagline: 'React on the front, Node and Postgres behind it, one person accountable for both.',
    bio: 'Four years shipping full-stack products with real users on them. Writes the migration and the rollback before the feature, tests on a throttled connection and a real device, and treats keyboard navigation as part of the build rather than a later fix.',
    years: 4,
    skills: [
      { name: 'React & TypeScript', level: 5 },
      { name: 'Node.js',            level: 5 },
      { name: 'PostgreSQL',         level: 4 },
      { name: 'API Design',         level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Booking system rebuild', type: 'Engineering', blurb: 'Replaced a fragile cron-driven flow with an event queue and idempotent handlers.', metric: 'Double bookings to zero' },
      { title: 'Marketing site rebuild', type: 'Frontend',    blurb: 'Static-first rebuild with route-level code splitting and real image budgets.', metric: 'Lighthouse 71 to 98' },
    ],
    credentials: ['BS Software Engineering', '4 years in full-stack development'],
    stats: { projects: 11, rating: 4.8, onTime: 95, responseTime: 'within 4 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'zeeshan-ali',
    name: 'Zeeshan Ali',
    role: 'UI/UX Designer',
    dept: 'Design',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 28,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 28,
    tagline: 'Screens, states and the small details that decide whether an interface feels finished.',
    bio: 'Three years on interface and visual design across web and mobile products. Hands over files a developer can build from without a meeting: named layers, real content, and every state drawn rather than described.',
    years: 3,
    skills: [
      { name: 'UI Design',          level: 5 },
      { name: 'Figma',              level: 5 },
      { name: 'Interaction Design', level: 4 },
      { name: 'Brand & Visual',     level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Mobile app interface',  type: 'UI Design',     blurb: 'Full screen set for iOS and Android, including the offline and error states.', metric: '4.6 average store rating' },
      { title: 'Brand and site design', type: 'Visual Design', blurb: 'Identity, type scale and a marketing site built on one set of tokens.', metric: 'Rolled out across 5 surfaces' },
    ],
    credentials: ['BDes', '3 years in UI/UX design'],
    stats: { projects: 9, rating: 4.7, onTime: 95, responseTime: 'within 5 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'dribbble', url: '#' }],
  },
  {
    slug: 'kiran',
    name: 'Kiran',
    role: 'ML Engineer',
    dept: 'AI/ML',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 35,
    minEngagement: 'From 15 hours',
    availability: 'available',
    hoursPerWeek: 28,
    tagline: 'Training pipelines, feature work and the retraining nobody remembers to schedule.',
    bio: 'Three years of machine learning engineering with an emphasis on what happens after the first good result: reproducible training runs, versioned data, and monitoring that notices drift before a client does.',
    years: 3,
    skills: [
      { name: 'Python',                 level: 5 },
      { name: 'scikit-learn / XGBoost', level: 4 },
      { name: 'MLOps Pipelines',        level: 4 },
      { name: 'Feature Engineering',    level: 4 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Forecasting pipeline', type: 'ML Engineering', blurb: 'Weekly demand forecasts with automated retraining and a held-out backtest on every run.', metric: 'Forecast error down 18%' },
      { title: 'Model monitoring',     type: 'MLOps',          blurb: 'Drift and data-quality checks wired to alerts on every production model.', metric: 'Silent failures down to zero' },
    ],
    credentials: ['BS Computer Science', '3 years in machine learning engineering'],
    stats: { projects: 8, rating: 4.9, onTime: 97, responseTime: 'within 5 hours' },
    socials: [{ id: 'linkedin', url: '#' }, { id: 'github', url: '#' }],
  },
  {
    slug: 'faiza-rehmat',
    name: 'Faiza Rehmat',
    role: 'Medical Biller',
    dept: 'Operations',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=top',
    location: 'Gilgit, PK',
    timezone: 'PKT',
    rate: 20,
    minEngagement: 'From 10 hours',
    availability: 'available',
    hoursPerWeek: 30,
    tagline: 'Clean claims, worked denials, and a revenue cycle that stops leaking.',
    bio: 'Three years in medical billing and revenue cycle work for US practices. Codes and submits claims, works the denials rather than writing them off, and keeps the ageing report short enough that nobody dreads opening it.',
    years: 3,
    skills: [
      { name: 'Medical Billing',     level: 5 },
      { name: 'CPT / ICD-10 Coding', level: 4 },
      { name: 'Denial Management',   level: 4 },
      { name: 'Insurance Claims',    level: 5 },
    ],
    languages: [{ name: 'Urdu', level: 'Native' }, { name: 'English', level: 'Fluent' }],
    portfolio: [
      { title: 'Denial recovery project', type: 'Revenue Cycle',   blurb: 'Worked a year of written-off denials back through appeals with corrected coding.', metric: 'Clean-claim rate to 97%' },
      { title: 'Billing cleanup',         type: 'Medical Billing', blurb: 'Rebuilt the charge-entry routine and brought the ageing backlog down to current.', metric: 'Days in A/R from 52 to 29' },
    ],
    credentials: ['Certified medical billing training', '3 years in US medical billing'],
    stats: { projects: 7, rating: 4.9, onTime: 98, responseTime: 'within 6 hours' },
    socials: [{ id: 'linkedin', url: '#' }],
  },
]

/* Looking a member up by slug, or finding who else to show beside them,
   is done through useMember / useRelatedMembers in hooks/useSiteContent.js,
   which read the live roster rather than this fallback copy. */

export const formatRate = rate => `$${rate}`
