/**
 * Headline metrics — the single source for every number quoted on the site.
 *
 * These were previously hardcoded per section and had drifted into open
 * contradictions on the same page. Everything now reads from here.
 *
 * ⚠️  Sized for a studio founded in 2025. The figures below are plausible
 * placeholders for a first year, not audited numbers — they are still YOURS
 * to set. Edit them here once and every section follows.
 *
 * Note on `avgExperience`: the studio is new, so "years in practice" reads
 * as 1 and says nothing about who does the work. This figure is the roster
 * average of each person's own career, and must be recomputed from
 * `TEAM[].years` whenever the roster changes.
 */
export const METRICS = {
  projects:      { value: 24,  suffix: '+',  label: 'Projects delivered',
                   desc: 'Since opening in 2025: MVPs, platform builds and rescues.' },
  satisfaction:  { value: 98,  suffix: '%',  label: 'Client satisfaction',
                   desc: "Measured post-delivery across every engagement we've shipped." },
  avgExperience: { value: 3,   suffix: '+',  label: 'Avg. years per specialist',
                   desc: 'Ten specialists, three to five years each in their own field.' },
  rating:        { value: 4.9, suffix: '★', decimals: 1, label: 'Average rating',
                   desc: 'Collected directly from clients after each engagement.' },
  countries:     { value: 9,   suffix: '+',  label: 'Countries served' },
  industries:    { value: 8,   suffix: '+',  label: 'Industries' },
  years:         { value: 1,   suffix: '+',  label: 'Years in practice' },
}

/**
 * Founding year and headcount. Everything dated on the site — the About
 * timeline, the facts strip, the story copy — derives from these.
 */
export const FOUNDED = 2025
export const TEAM_SIZE = 10

/** "24+", "$50", "4.9★" — one formatter so every surface renders alike. */
export const format = key => {
  const m = METRICS[key]
  if (!m) return ''
  const n = m.decimals ? m.value.toFixed(m.decimals) : m.value
  return `${m.prefix ?? ''}${n}${m.suffix ?? ''}`
}
