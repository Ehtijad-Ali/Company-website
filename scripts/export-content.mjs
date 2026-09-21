/**
 * Writes server/seed/content.json from the frontend's own data modules.
 *
 * The site's editable sections live in the database, but their *starting*
 * value is the content that ships with the build. Generating the seed from
 * the same modules the frontend falls back to means the two cannot drift:
 * there is one copy of the roster in the repo, not one for the bundle and
 * another for SQL.
 *
 * The server seeds a section only when it has no row for it, so running
 * this and restarting never overwrites an edit made through the admin.
 * Putting the seed back deliberately is POST /api/content/<key>/reset.
 *
 * Run with `npm run content:seed`; also runs on `npm run build`.
 *
 * Every module imported here must be plain data — no asset imports, no JSX,
 * nothing that needs a bundler — because Node executes them as-is.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { TEAM } from '../src/data/team.js'
import { SERVICES } from '../src/data/services.js'
import { PROJECTS } from '../src/data/portfolio.js'
import { POSTS } from '../src/data/posts.js'
import { COURSES } from '../src/data/courses.js'
import { ABOUT } from '../src/data/about.js'
import { CONTACT } from '../src/data/contact.js'
import { ADVISOR } from '../src/data/advisor.js'
import { COURSES_PAGE } from '../src/data/coursesPage.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'server', 'seed', 'content.json')

/** Keys must match CONTENT_SPEC in server/content.py. */
const content = {
  team: TEAM,
  services: SERVICES,
  portfolio: PROJECTS,
  posts: POSTS,
  courses: COURSES,
  about: ABOUT,
  contact: CONTACT,
  advisor: ADVISOR,
  coursesPage: COURSES_PAGE,
}

/* Catch the mistakes that would only surface as a blank section in
   production: a record with no slug, or two records sharing one. */
const problems = []
for (const [key, value] of Object.entries(content)) {
  if (!Array.isArray(value)) continue
  const seen = new Set()
  value.forEach((item, i) => {
    const slug = item?.slug
    if (!slug) problems.push(`${key}[${i}] has no slug`)
    else if (seen.has(slug)) problems.push(`${key} has two entries with slug "${slug}"`)
    else seen.add(slug)
  })
}

if (problems.length) {
  console.error('Cannot write content seed:')
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(content, null, 2) + '\n', 'utf8')

const summary = Object.entries(content)
  .map(([k, v]) => `${k}: ${Array.isArray(v) ? `${v.length} items` : 'document'}`)
  .join(', ')
console.log(`Wrote server/seed/content.json (${summary})`)
