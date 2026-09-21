/**
 * The /courses page, minus the catalogue itself.
 *
 * The hero copy, the three steps and the questions people ask before they
 * pay. Kept here rather than in the page component so the teaching side can
 * be rewritten without a deploy — the same reason the roster and the
 * services live in the content API.
 *
 * ⚠️  NO FEES ARE STATED, here or in data/courses.js. A published price is
 * a promise. Add one in both places once the real numbers are agreed.
 *
 * Plain data only, no imports: this is a content document. See data/team.js
 * for the rule in full.
 */

export const COURSES_PAGE = {
  eyebrow: 'Courses',
  /** `em` italicises in the brand colour, as in every other headline. */
  title: [{ t: 'We also ' }, { t: 'teach this work', em: true }],
  subtitle: 'Three-month mentored courses, taught by the people who do this for a living. The full month-by-month plan is published before you pay, so you can see the whole road before you commit to any of it.',

  /** The four facts under the headline. `{count}` becomes the live number. */
  facts: [
    { label: 'Courses',        value: '{count}' },
    { label: 'Each runs',      value: '3 months' },
    { label: 'Taught by',      value: 'Working practitioners' },
    { label: 'Plan published', value: 'Before you pay' },
  ],

  /** `icon` is a name from lib/icons.js. */
  steps: [
    { icon: 'MessageSquare', n: '01', title: 'Tell us where you are',
      text: 'A short call, or the course finder below. We would rather talk you out of the wrong course than enrol you in it.' },
    { icon: 'Layers', n: '02', title: 'Three months, one plan',
      text: 'Every month has a focus, a set of topics and a project. It is written down before you start and it does not move.' },
    { icon: 'Rocket', n: '03', title: 'Finish with something real',
      text: 'Not a certificate. A project in your portfolio, reviewed by someone who does this work for clients.' },
  ],

  mentorsTitle: [{ t: 'Taught by the people who ' }, { t: 'do the work', em: true }],
  mentorsNote: 'Not career instructors. Every mentor here bills for this skill during the week and teaches it in the evening, which is why the plans change as the work does.',

  ctaTitle: 'Still not sure which one?',
  ctaText: 'Tell us what you want to be doing in a year and we will tell you which course gets you there, including when the honest answer is none of them.',
  ctaLabel: 'Ask us directly',
}
