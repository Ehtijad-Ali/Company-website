/**
 * About content — the home About section and the /about page.
 *
 * Previously five separate arrays and a wall of prose hardcoded across two
 * components, which meant editing the studio's own story required a code
 * change and a deploy. It is all one document now, served by the content
 * API with this module as the offline fallback.
 *
 * Plain data only, no imports: serialised into the content API seed.
 * See data/team.js for the rule in full.
 */

export const ABOUT = {
  /** Home section: commitments, not adjectives. Each line is something a
   *  client could hold us to, which is the point of the list. */
  pillars: [
    { n: '01', title: 'One team, no handoffs',   text: 'The people who design it are the people who build it.' },
    { n: '02', title: 'Milestones up front',     text: 'You know what lands when, before we start.' },
    { n: '03', title: 'Performance is a budget', text: 'Core Web Vitals are set at kickoff, not measured at the end.' },
    { n: '04', title: 'You own everything',      text: 'IP assignment in every contract. No exceptions.' },
    { n: '05', title: '30-day warranty',         text: 'Every launch. Retainers after, if you want them.' },
    { n: '06', title: "We'll tell you when we disagree", text: 'Including when the simpler, cheaper option is the right one.' },
  ],

  /** The manifesto panel on the home page. `em` italicises in brand colour. */
  manifesto: {
    eyebrow: 'Manifesto',
    lines: [
      [{ t: 'Design and code' }],
      [{ t: 'are the ' }, { t: 'same job', em: true }],
      [{ t: 'done twice.' }],
    ],
  },

  /** /about opening statement. Rendered one line per row, so keep each
   *  short — they are set to not wrap. */
  opening: {
    headline: [
      [{ t: 'We stayed ' }, { t: 'small', em: true }],
      [{ t: 'on purpose.' }],
    ],
    /** `{teamSize}` is substituted from metrics at render time. */
    intro: 'Most studios grow until the people who won the work are no longer the people doing it. We decided not to, which is why there are still {teamSize} of us, and why you will meet everyone who touches your project.',
  },

  story: {
    paragraphs: [
      'CodeNode began in 2025 with a frustration our founders kept running into from the client side: agencies that promised premium work and delivered something average, wrapped in an expensive presentation. The people in the pitch were rarely the people who showed up afterwards.',
      'They had spent their careers at companies where design and engineering sat in different buildings and shipped through a translation layer, and had watched what that costs in revisions, misunderstandings and quietly abandoned detail. So the studio was built with one team from the start. The person who draws it is the person who builds it.',
      'That constraint shapes everything downstream. We deliberately take on fewer engagements than we could fill, because every one is reviewed by someone senior end to end. We turn work down when we cannot staff it properly. And we say so early when a plan stops being the right one, which is not always the comfortable conversation.',
      'We are early, and we would rather say so than pretend otherwise. What has not moved since day one is the thing we are obsessive about: making things that genuinely work, and that hold up two years after launch.',
    ],
    /** Set after the second paragraph. */
    quote: 'Growth was never the goal. Being the studio we would have hired was.',
    caption: 'Small enough that everyone knows what everyone else shipped this week.',
  },

  /**
   * Timeline for a studio founded in 2025 — roughly eighteen months of
   * history, so these are quarters rather than years. Keep it honest: a
   * short list of real decisions reads better than a padded decade.
   */
  milestones: [
    { year: 'Q1 2025', title: 'Four people, one rule',
      event: 'Founded on a simple constraint: never take on more work than the founders can personally review.' },
    { year: 'Q2 2025', title: 'First platform build',
      event: 'A logistics client took a chance on a three-month-old studio. It shipped on time and they came back.' },
    { year: 'Q3 2025', title: 'Design and engineering merge',
      event: 'Stopped running them as separate practices. Every engagement since has had one team and no handoff.' },
    { year: 'Q4 2025', title: 'The first refusal',
      event: 'Turned down our largest enquiry to date because we could not staff it without hiring people we had not worked with.' },
    { year: 'Q1 2026', title: 'AI practice opens',
      event: 'First production ML systems shipped, for clients in fintech and logistics.' },
    { year: 'Q2 2026', title: 'Individually bookable',
      event: 'Opened the roster so clients can engage a single specialist by the hour, not just a whole project team.' },
  ],

  principles: [
    { n: '01', title: 'Craft over speed',
      desc: 'We do not ship things we are not prepared to put our names on. When a deadline and the quality bar collide, we renegotiate the deadline, and we tell you early enough that it is still a choice.' },
    { n: '02', title: 'Radical transparency',
      desc: 'You see the same board we do. Blockers surface the day they appear, not in a status call two weeks later. If we are behind, you will hear it from us first.' },
    { n: '03', title: 'Outcomes, not outputs',
      desc: 'We measure engagements by what changed in your business, not by tickets closed or hours logged. Occasionally that means arguing you out of the thing you asked for.' },
    { n: '04', title: 'Always learning',
      desc: 'A fifth of every quarter is protected for R&D and upskilling. It is the reason we can still recommend the boring, proven option with a straight face.' },
  ],

  /** Signed by whoever holds the founder role in the roster, so the note
   *  cannot end up attributed to someone who has left. */
  founderNote: "We didn't set out to build the biggest studio. We set out to build the one we would have hired: obsessive about craft, honest about timelines, allergic to mediocrity.",

  /** `icon` is a name from lib/icons.js. */
  culture: [
    { icon: 'Globe2',       value: '100%',  label: 'Remote-first',      desc: 'A distributed team across six Pakistani cities, async-first, no mandatory 9-to-5.' },
    { icon: 'FlaskConical', value: '20%',   label: 'R&D every quarter', desc: 'Protected time each quarter for experimentation and learning.' },
    { icon: 'Zap',          value: '<48h',  label: 'Decision speed',    desc: 'Flat structure, no approval chains. The right person decides, fast.' },
    { icon: 'Heart',        value: '4.9/5', label: 'Team satisfaction', desc: 'Measured twice a year. We publish the result either way.' },
  ],

  beliefs: [
    'Great code is read far more often than it is written.',
    'Design without engineering constraints is decoration.',
    'The best feature is the one you choose not to build.',
    'Slow is smooth. Smooth is fast.',
    'Every bug is a process failure, not a person failure.',
    'Ship early, iterate publicly, improve relentlessly.',
  ],
}
