/**
 * Case studies shown on /portfolio.
 *
 * ⚠️  PLACEHOLDER CLIENT WORK
 * These projects, clients and outcome figures are invented for layout
 * purposes. Naming a client you have not worked with, or quoting a revenue
 * lift you did not produce, is the kind of claim that ends badly — replace
 * every record here with real work before this faces buyers.
 *
 * `result` is the one-line outcome the year timeline shows; `desc` is the
 * longer version on the card. Both come from the same record so the two
 * views of a project cannot disagree.
 *
 * Plain data only, no imports: this module is serialised into the content
 * API seed. See data/team.js for the rule in full.
 */

export const PROJECTS = [
  {
    slug: 'neurocommerce',
    title: 'NeuroCommerce',
    cat: 'AI/ML',
    year: '2026',
    client: 'RetailMax Corp',
    desc: 'AI-powered e-commerce platform with real-time personalisation and predictive inventory. Increased revenue by 58%.',
    result: '+58% revenue',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=600&fit=crop',
    tags: ['React', 'TensorFlow', 'Node.js', 'PostgreSQL'],
    featured: true,
  },
  {
    slug: 'healthpulse',
    title: 'HealthPulse',
    cat: 'Mobile',
    year: '2026',
    client: 'WellPath Inc',
    desc: 'Cross-platform health monitoring app with ML-driven biometric insights and wearable device sync.',
    result: '120k users',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=600&fit=crop',
    tags: ['React Native', 'Python', 'FastAPI'],
  },
  {
    slug: 'aether-crm',
    title: 'Aether CRM',
    cat: 'SaaS',
    year: '2026',
    client: 'SalesForce Pro',
    desc: 'Next-gen CRM featuring an AI sales assistant, automated pipeline management, and predictive close rates.',
    result: '40% faster pipeline',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop',
    tags: ['Next.js', 'PostgreSQL', 'Redis'],
  },
  {
    slug: 'metaverse-hub',
    title: 'MetaVerse Hub',
    cat: 'Web3',
    year: '2025',
    client: 'MetaSpace DAO',
    desc: 'Immersive 3D virtual workspace with WebXR presence and on-chain identity/ownership layer.',
    result: '9k DAU at launch',
    img: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=900&h=600&fit=crop',
    tags: ['Three.js', 'Solidity', 'WebXR'],
    featured: true,
  },
  {
    slug: 'flowdesk',
    title: 'FlowDesk',
    cat: 'SaaS',
    year: '2025',
    client: 'Notion Alternative',
    desc: 'Real-time collaborative design tool built in the browser. Live cursors, conflict resolution, export engine.',
    result: '4k beta signups',
    img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&h=600&fit=crop',
    tags: ['WebSockets', 'Canvas API', 'React'],
  },
  {
    slug: 'skyanalytics',
    title: 'SkyAnalytics',
    cat: 'AI/ML',
    year: '2025',
    client: 'AgriTech Global',
    desc: 'Satellite imagery analysis platform powering crop yield predictions and precision agriculture at scale.',
    result: '94% prediction accuracy',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop',
    tags: ['PyTorch', 'GIS', 'FastAPI'],
  },
  {
    slug: 'payflow',
    title: 'PayFlow',
    cat: 'FinTech',
    year: '2025',
    client: 'NeoBank',
    desc: 'Real-time payment processing platform with sub-100ms transaction times and a full audit trail.',
    result: 'sub-100ms settlement',
    img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900&h=600&fit=crop',
    tags: ['Node.js', 'Kafka', 'PostgreSQL'],
  },
  {
    slug: 'eduspace',
    title: 'EduSpace',
    cat: 'EdTech',
    year: '2025',
    client: 'LearnerLab',
    desc: 'Adaptive learning platform with AI tutor, live collaboration, and personalised curriculum generation.',
    result: '30k learners enrolled',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=600&fit=crop',
    tags: ['React', 'LangChain', 'AWS'],
  },
  {
    slug: 'greentrack',
    title: 'GreenTrack',
    cat: 'SaaS',
    year: '2025',
    client: 'EcoMetrics',
    desc: 'ESG reporting and carbon tracking platform for Fortune 500 sustainability teams.',
    result: 'ESG reporting for 40 teams',
    img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&h=600&fit=crop',
    tags: ['Next.js', 'D3.js', 'Prisma'],
  },
]

/**
 * The year timeline, newest first. Grouping the same records rather than
 * keeping a second list of them: the page used to hold both, and six of the
 * nine projects were written out twice with different outcome figures.
 */
export const projectsByYear = (projects = PROJECTS) => {
  const years = new Map()
  for (const p of projects) {
    if (!p.year) continue
    if (!years.has(p.year)) years.set(p.year, [])
    years.get(p.year).push(p)
  }
  return [...years.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, projects: items }))
}

/**
 * Filter chips, derived from whatever projects are loaded rather than
 * hardcoded — adding a project in the admin adds its category here, and
 * removing the last project in a category removes an empty filter.
 */
export const projectCats = (projects = PROJECTS) =>
  ['All', ...Array.from(new Set(projects.map(p => p.cat).filter(Boolean)))]
