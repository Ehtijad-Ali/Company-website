/**
 * Blog posts.
 *
 * Posts carry an author *slug*, not a loose name string, so every byline
 * resolves to a real roster profile and cannot drift out of sync with it.
 * Add a post in the admin and give it an author that exists in the team
 * collection, or the byline falls back to the studio name.
 *
 * ⚠️  These are headlines and excerpts without articles behind them — the
 * cards currently link to /blog itself. Either write the posts or cut the
 * section before launch; a blog of six dead links reads worse than no blog.
 *
 * Plain data only, no imports: serialised into the content API seed.
 * See data/team.js for the rule in full.
 */

export const POSTS = [
  {
    slug: 'saas-architecture',
    title: 'The architecture behind our busiest build yet',
    cat: 'Engineering',
    date: 'Jun 2026',
    read: 8,
    author: 'ehtijad-ali',
    featured: true,
    excerpt: 'The infrastructure decisions behind a platform that went from zero to real traffic in one release cycle, including the two we would make differently now.',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=700&fit=crop',
  },
  {
    slug: 'llm-fine-tuning',
    title: 'Why LLM fine-tuning is overrated',
    cat: 'AI/ML',
    date: 'Jun 2026',
    read: 6,
    author: 'almeen-zahra',
    excerpt: 'When prompting, RAG and a large context window solve 80% of use cases, fine-tuning is an expensive answer to a question nobody asked.',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop',
  },
  {
    slug: 'design-systems-cost',
    title: 'The real cost of design systems',
    cat: 'Design',
    date: 'May 2026',
    read: 5,
    author: 'badar-muneem',
    excerpt: "A design system is a bet on the future. Here's how to work out whether the bet is worth making before you spend a quarter on it.",
    img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
  },
  {
    slug: 'core-web-vitals',
    title: 'Core Web Vitals: from 45 to 98 in three weeks',
    cat: 'Performance',
    date: 'May 2026',
    read: 7,
    author: 'hasnain-khush',
    excerpt: 'A step-by-step account of diagnosing and removing every performance bottleneck in a legacy Next.js application.',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  },
  {
    slug: 'mobile-retention',
    title: 'Mobile retention: the metrics that actually matter',
    cat: 'Growth',
    date: 'Apr 2026',
    read: 4,
    author: 'zeeshan-karim',
    excerpt: 'D1, D7 and D30 are table stakes. These are the leading indicators that predict churn before it shows up in them.',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
  },
  {
    slug: '3d-on-the-web',
    title: "3D on the web: what's worth using",
    cat: 'Engineering',
    date: 'Apr 2026',
    read: 9,
    author: 'zeeshan-ali',
    excerpt: 'Three.js, WebGPU, React Three Fiber, Babylon: an opinionated guide to which are worth your time and which are hype.',
    img: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=800&h=500&fit=crop',
  },
]

/** Filter chips, derived from the posts that are actually loaded. */
export const postCats = (posts = POSTS) =>
  ['All', ...Array.from(new Set(posts.map(p => p.cat).filter(Boolean)))]
