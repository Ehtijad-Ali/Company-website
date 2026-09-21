/**
 * Image catalogue.
 *
 * Every photograph on the site is referenced from here rather than pasted
 * into a component, so the set can be swapped wholesale when real
 * photography exists without hunting through JSX.
 *
 * ⚠️  STOCK PHOTOGRAPHY, HOTLINKED FROM UNSPLASH
 * These are not our images and they are not served from our infrastructure.
 * Every ID below was rendered and visually checked before being added, but
 * hotlinking means an image can disappear without warning and we carry no
 * licence record for commercial use. Before this is a real client-facing
 * site, replace these with photography we own and serve locally. The
 * treatment in `EditorialImage` will carry over unchanged.
 *
 * Unsplash serves a resized file per query string, so ask for the size the
 * layout actually needs rather than shipping a 4000px original.
 */

const CDN = 'https://images.unsplash.com/'

/** Build a sized, cropped URL for one catalogue id. */
export const img = (id, w = 1200, h = 800) =>
  `${CDN}${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`

/* ── Studio and people ─────────────────────────────────────────
   Warm interiors chosen to sit with the terracotta palette. */
export const STUDIO = {
  /** Warm modern office, wood and amber accents. The closest to our palette. */
  office:     'photo-1715593949273-09009558300a',
  /** Hands, paper models and colour swatches. Reads as craft, not corporate. */
  craft:      'photo-1695712551846-4dc15433fbd4',
  /** Clean single desk, warm wood, plants. */
  desk:       'photo-1647790292957-c7f3b44b3973',
  /** Home studio at a window, creative clutter. */
  homeStudio: 'photo-1756723902378-7073227e8ece',
  /** Dark room, bright window. A quiet beat between loud sections. */
  quiet:      'photo-1782706946527-dbedfa3e6e32',
}

/* ── Textures ──────────────────────────────────────────────────
   Used only as section plates, knocked back behind a scrim. */
export const TEXTURE = {
  /** Wavy sandstone strata, rich warm brown. */
  sandstone: 'photo-1635315619556-5826839a1bea',
  /** Terracotta breeze-block lattice. Architectural rhythm. */
  lattice:   'photo-1779155226564-3ab12f55b3a1',
  /** Soft pink-into-terracotta stucco. The most minimal of the four. */
  stucco:    'photo-1789659530185-0a241067e007',
  /** Weathered red paper. */
  clay:      'photo-1537204319452-fdbd29e2ccc7',
}

/* ── One image per service ─────────────────────────────────────
   Keyed by the service title so a row can look itself up. */
export const SERVICE_IMG = {
  'Web Development':         'photo-1647790292957-c7f3b44b3973',
  'AI & Machine Learning':   'photo-1677442135703-1787eea5ce01',
  'UI / UX Design':          'photo-1558655146-9f40138edfeb',
  'Mobile Applications':     'photo-1512941937669-90a1b58e7e9c',
  'Cloud & DevOps':          'photo-1558494949-ef010cbdcc31',
  'Digital Marketing':       'photo-1460925895917-afdab827c52f',
  'Cybersecurity':           'photo-1451187580459-43490279c0fa',
  'Performance Engineering': 'photo-1473341304170-971dccb5ac1e',
}

/* ── One image per course ──────────────────────────────────────
   Keyed by slug, with a per-field fallback for a course added in the
   admin that has no image of its own. A catalogue of twelve text cards
   reads as a list of headings; the image is what makes it a course. */
export const COURSE_IMG = {
  'web-development':        'photo-1647790292957-c7f3b44b3973',
  'ai-and-data-science':    'photo-1677442135703-1787eea5ce01',
  'digital-marketing':      'photo-1460925895917-afdab827c52f',
  'ui-ux-design':           'photo-1558655146-9f40138edfeb',
  'data-analyst':           'photo-1473341304170-971dccb5ac1e',
  'cloud-computing':        'photo-1558494949-ef010cbdcc31',
  'wordpress':              'photo-1756723902378-7073227e8ece',
  'ecommerce':              'photo-1556742049-0cfed4f6a45d',
  'mobile-app-development': 'photo-1512941937669-90a1b58e7e9c',
  'graphic-design':         'photo-1695712551846-4dc15433fbd4',
  'cybersecurity':          'photo-1451187580459-43490279c0fa',
  'python-programming':     'photo-1509062522246-3755977927d7',
}

const FIELD_IMG = {
  Engineering:  'photo-1647790292957-c7f3b44b3973',
  'AI / Data':  'photo-1677442135703-1787eea5ce01',
  Design:       'photo-1558655146-9f40138edfeb',
  Growth:       'photo-1460925895917-afdab827c52f',
}

/**
 * The image for a course: its own `image` id if the record carries one,
 * then the catalogue above, then something from the right field, then the
 * studio desk. A course always has a picture.
 */
export const courseImage = (course, w = 800, h = 520) =>
  img(course?.image || COURSE_IMG[course?.slug] || FIELD_IMG[course?.field] || STUDIO.desk, w, h)

/* ── One image per delivery phase ──────────────────────────────
   Keyed by phase index, in the order Process renders them. */
export const PHASE_IMG = [
  'photo-1695712551846-4dc15433fbd4', // discovery — paper, swatches, thinking
  'photo-1756723902378-7073227e8ece', // planning  — the studio at work
  'photo-1647790292957-c7f3b44b3973', // build     — the desk
  'photo-1473341304170-971dccb5ac1e', // launch    — lines at sunset
  'photo-1558494949-ef010cbdcc31',    // support   — racks, the thing that keeps running
]
