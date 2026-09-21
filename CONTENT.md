# Editing site content

The team, services, portfolio, blog, courses, about and contact sections are
stored in the backend and edited from **/admin → Site Content**. Changing a
job title, a price or a case study no longer needs a code change or a
deploy.

## How a page gets its content

1. The page renders the copy bundled in the build immediately — the modules
   in `src/data/` (`team.js`, `services.js`, `portfolio.js`, `posts.js`,
   `courses.js`, `about.js`, `contact.js`).
2. `ContentProvider` fetches `GET /api/content` once per page load and swaps
   in whatever the backend returns.
3. If the backend is down, not deployed, or returns a section that is empty
   or the wrong shape, that section keeps its bundled copy.

So the site never renders an empty section, and the worst case for a broken
backend is content that is as old as the last deploy. The trade is that an
edit can appear a moment after first paint.

## Editing

Open `/admin`, sign in as an admin, and pick **Site Content**.

- **Collections** (team, services, portfolio, blog, courses) are edited one
  record at a time: add, edit, delete. The common fields have inputs; nested
  fields — a member's skills, a course's months, a service's features — are
  edited as JSON below them. Both views edit the same record, so a change in
  one shows up in the other.
- **Documents** (about, contact, course finder, courses page) are edited
  whole.
- **Restore defaults** (the ↺ button) puts a section back to what shipped
  with the build, discarding every edit to it.

Slugs are used in URLs (`/team/<slug>`, `/courses/<slug>`), so they must be
lowercase letters, numbers and single hyphens, and unique within a section.
Changing a member's slug breaks any course or post that lists them as
`mentor`/`author`, and any link anyone has saved.

Icons are stored as *names* (`Brain`, `Mail`, `Globe2`) from
`src/lib/icons.js`. A name that is not in that file renders a generic mark;
adding a new icon to the picker means adding it to that file.

## Changing the defaults

The bundled copy and the database seed come from the same modules:

```
npm run content:seed     # writes server/seed/content.json from src/data/*
```

It also runs on `npm run build`. On startup the server seeds any section it
has no row for, and **never overwrites a section that already exists** — so
redeploying cannot silently revert an edit made in the admin. To take a new
default from the build, use Restore defaults on that section.

## API

Reads are public; every write needs an admin token.

| Method | Path | |
|---|---|---|
| GET | `/api/content` | every section in one response |
| GET | `/api/content/<key>` | one section |
| PUT | `/api/content/<key>` | replace a whole section |
| POST | `/api/content/<key>/items` | add one record to a collection |
| PUT | `/api/content/<key>/items/<id>` | replace one record |
| DELETE | `/api/content/<key>/items/<id>` | remove one record |
| POST | `/api/content/<key>/reset` | restore the seeded copy |

Sections: `team`, `services`, `portfolio`, `posts`, `courses`, `about`,
`contact`, `advisor`, `coursesPage`. Every write is recorded in
`admin_logs`.

### The courses page

`coursesPage` holds everything on /courses except the catalogue and the
mentors: the hero copy and its four facts, the three "how it runs" steps,
and the questions people ask before they pay. The catalogue is the live
`courses` collection and the mentor tiles are derived from it — whoever is
set as a course's `mentor` appears there, with the courses they teach.

Course images: a course record can carry an `image` (an Unsplash photo id).
Without one it falls back to the per-slug catalogue in `src/data/imagery.js`,
then to something from its field, so a course added in the admin always has
a picture.

### The course finder

`advisor` holds the questions behind the panel above the course catalogue.
Each option carries a `signal` — which fields, levels, keywords or weekly
hours it favours, and the `reason` shown on a result when it contributed.
Nothing there names a course except as a last resort, so **a course added in
the admin is matched automatically** on its own field, level, hours and
tools. The weights and the wording are explained at the top of
`src/data/advisor.js`; the scoring itself is `src/lib/advisor.js`.

## What is still hardcoded

Headline metrics (`src/data/metrics.js`), FAQs (`src/data/faqs.js`), SEO and
site facts (`src/data/site.js`, `src/data/seo.js`) and the imagery catalogue
(`src/data/imagery.js`) are still build-time. `site.js` in particular has to
be, because `<head>`, the sitemap and structured data are generated before
any API call happens — the contact document fills its blank channel values
from it so the two cannot disagree on screen.
