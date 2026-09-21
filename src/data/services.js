/**
 * Service catalogue.
 *
 * One record per discipline, feeding both the home Services section (num,
 * cat, desc, chips) and the /services grid (price, features). The two used
 * to be separate hardcoded arrays that had already drifted apart — the home
 * page said "Performance Engineering" while the services page sold a
 * "Performance Audit".
 *
 * ⚠️  `price` is a public commitment. These are the figures the site has
 * always shown; change them here and both surfaces follow.
 *
 * `icon` is a *name* from lib/icons.js, not a component, because this whole
 * module is serialised into the content API seed. Keep every record plain
 * data — see data/team.js for the full rule.
 */

export const SERVICES = [
  {
    slug: 'web-development',
    num: '01',
    icon: 'Code2',
    cat: 'Engineering',
    title: 'Web Development',
    price: 'From $8,000',
    desc: 'We architect blazing-fast, scalable web applications with React, Next.js, Node.js, and modern cloud infrastructure, from MVPs to enterprise platforms handling millions of users.',
    chips: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    features: [
      'Custom React / Next.js applications',
      'RESTful & GraphQL APIs',
      'Database design & optimisation',
      'Performance-first architecture',
      'CI/CD & DevOps setup',
      '3 months post-launch support',
    ],
  },
  {
    slug: 'ai-machine-learning',
    num: '02',
    icon: 'Brain',
    cat: 'Intelligence',
    title: 'AI & Machine Learning',
    price: 'From $12,000',
    desc: 'Intelligent automation, NLP, computer vision, and predictive analytics that turn raw data into decisive competitive advantage, built to scale in production.',
    chips: ['TensorFlow', 'PyTorch', 'LangChain'],
    features: [
      'Custom model training & fine-tuning',
      'LLM integration (GPT-4, Claude, Llama)',
      'Predictive analytics dashboards',
      'Computer vision pipelines',
      'NLP & document processing',
      'MLOps & monitoring',
    ],
  },
  {
    slug: 'ui-ux-design',
    num: '03',
    icon: 'Palette',
    cat: 'Design',
    title: 'UI / UX Design',
    price: 'From $5,000',
    desc: 'Intuitive, award-winning interfaces crafted with meticulous attention to user psychology, visual hierarchy, and brand coherence. Design that converts.',
    chips: ['Figma', 'Prototyping', 'Design Systems'],
    features: [
      'Discovery & user research',
      'Information architecture',
      'High-fidelity prototypes',
      'Design system creation',
      'Usability testing',
      'Figma hand-off',
    ],
  },
  {
    slug: 'mobile-applications',
    num: '04',
    icon: 'Smartphone',
    cat: 'Mobile',
    title: 'Mobile Applications',
    price: 'From $10,000',
    desc: 'Native iOS, Android, and cross-platform React Native apps. Beautiful, performant experiences users love and return to, shipped on schedule.',
    chips: ['React Native', 'Swift', 'Kotlin'],
    features: [
      'React Native cross-platform',
      'Native iOS (Swift)',
      'Native Android (Kotlin)',
      'App Store & Play Store submission',
      'Push notifications & deep linking',
      'Offline-first architecture',
    ],
  },
  {
    slug: 'cloud-devops',
    num: '05',
    icon: 'Cloud',
    cat: 'Infrastructure',
    title: 'Cloud & DevOps',
    price: 'From $6,000',
    desc: 'AWS, Azure, and GCP architecture with automated CI/CD pipelines, containerisation, and cloud-native infrastructure that scales without breaking.',
    chips: ['AWS', 'Docker', 'Kubernetes'],
    features: [
      'AWS / GCP / Azure architecture',
      'Kubernetes & container orchestration',
      'Infrastructure as Code (Terraform)',
      'Zero-downtime deployment',
      'Security hardening',
      'Cost optimisation',
    ],
  },
  {
    slug: 'digital-marketing',
    num: '06',
    icon: 'BarChart3',
    cat: 'Growth',
    title: 'Digital Marketing',
    price: 'From $3,000/mo',
    desc: 'Data-driven growth strategies across SEO, paid media, and high-conversion content, compounding returns built on rigorous measurement.',
    chips: ['SEO / SEM', 'PPC', 'Analytics'],
    features: [
      'SEO strategy & technical audit',
      'Google / Meta paid campaigns',
      'Content strategy & creation',
      'Conversion rate optimisation',
      'Monthly reporting dashboards',
      'A/B testing programmes',
    ],
  },
  {
    slug: 'cybersecurity',
    num: '07',
    icon: 'Shield',
    cat: 'Security',
    title: 'Cybersecurity',
    price: 'From $4,000',
    desc: 'Penetration testing, security audits, compliance frameworks (SOC 2, ISO 27001), and proactive threat modelling before the breach happens.',
    chips: ['OWASP', 'SOC 2', 'Pen Testing'],
    features: [
      'Full penetration testing',
      'OWASP Top 10 audit',
      'SOC 2 preparation',
      'Vulnerability assessments',
      'Employee security training',
      'Incident response planning',
    ],
  },
  {
    slug: 'performance-engineering',
    num: '08',
    icon: 'Zap',
    cat: 'Optimization',
    title: 'Performance Engineering',
    price: 'From $2,500',
    desc: 'Deep-dive audits, critical rendering path surgery, and edge-layer caching delivering sub-second load times and perfect Core Web Vitals scores.',
    chips: ['Lighthouse', 'WebVitals', 'CDN'],
    features: [
      'Core Web Vitals optimisation',
      'Lighthouse audit & fixes',
      'Bundle analysis & code splitting',
      'CDN configuration',
      'Image & asset optimisation',
      'Monthly performance report',
    ],
  },
]

/** The service names the contact form offers, derived so they cannot drift. */
export const serviceOptions = (services = SERVICES) => services.map(s => s.title)
