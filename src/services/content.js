/**
 * Editable content, fetched from the backend.
 *
 * Every section the studio wants to edit without a deploy — the roster, the
 * services, the case studies, the posts, the courses, the about copy and the
 * contact details — is stored server-side and served from /api/content.
 *
 * The bundled modules in data/ remain in the build as the fallback. The page
 * renders them immediately, then swaps in whatever the API returns. That
 * ordering is deliberate:
 *
 *   - nothing ever renders an empty section or a spinner,
 *   - a backend that is down, slow or not deployed at all degrades to the
 *     content that shipped with the build rather than to a blank page,
 *   - and the first paint does not wait on a network round trip.
 *
 * The cost is that an edit can appear a moment after load. For a marketing
 * site that is the right trade; for anything transactional it would not be.
 */
import { TEAM } from '../data/team'
import { SERVICES } from '../data/services'
import { PROJECTS } from '../data/portfolio'
import { POSTS } from '../data/posts'
import { COURSES } from '../data/courses'
import { ABOUT } from '../data/about'
import { CONTACT } from '../data/contact'
import { ADVISOR } from '../data/advisor'
import { COURSES_PAGE } from '../data/coursesPage'

/**
 * The sections the API serves, and the shape each one must have.
 *
 * `kind` is how the admin edits it and how a response is validated:
 * a collection is a list of records with a stable id, a document is a
 * single object. Anything that comes back the wrong shape is ignored in
 * favour of the fallback, so one malformed row cannot blank a page.
 */
export const SECTIONS = {
  team:      { kind: 'collection', idField: 'slug', label: 'Team',      fallback: TEAM },
  services:  { kind: 'collection', idField: 'slug', label: 'Services',  fallback: SERVICES },
  portfolio: { kind: 'collection', idField: 'slug', label: 'Portfolio', fallback: PROJECTS },
  posts:     { kind: 'collection', idField: 'slug', label: 'Blog',      fallback: POSTS },
  courses:   { kind: 'collection', idField: 'slug', label: 'Courses',   fallback: COURSES },
  about:     { kind: 'document',                    label: 'About',     fallback: ABOUT },
  contact:   { kind: 'document',                    label: 'Contact',   fallback: CONTACT },
  advisor:   { kind: 'document',                    label: 'Course finder', fallback: ADVISOR },
  coursesPage: { kind: 'document',                  label: 'Courses page',  fallback: COURSES_PAGE },
}

export const SECTION_KEYS = Object.keys(SECTIONS)

/** What the site renders before — and instead of — any API response. */
export const FALLBACK = Object.fromEntries(
  SECTION_KEYS.map(k => [k, SECTIONS[k].fallback])
)

const isPlainObject = v => v !== null && typeof v === 'object' && !Array.isArray(v)

/** True when `value` could plausibly be this section's content. */
export const isValidSection = (key, value) => {
  const spec = SECTIONS[key]
  if (!spec) return false
  if (spec.kind === 'collection') {
    return Array.isArray(value) && value.every(isPlainObject)
  }
  return isPlainObject(value)
}

/**
 * Merge an API payload over the fallbacks, one section at a time.
 * A section that is missing, empty or malformed keeps its bundled copy —
 * an empty roster is far more likely to be a backend problem than an
 * intentional decision to have no team.
 */
export const mergeContent = (payload) => {
  const merged = { ...FALLBACK }
  const sources = {}
  for (const key of SECTION_KEYS) {
    const value = payload?.[key]
    const usable = isValidSection(key, value) &&
      (SECTIONS[key].kind !== 'collection' || value.length > 0)
    merged[key] = usable ? value : FALLBACK[key]
    sources[key] = usable ? 'api' : 'fallback'
  }
  return { merged, sources }
}
