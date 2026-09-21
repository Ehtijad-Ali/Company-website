/**
 * Course advisor — the questions behind the panel on /courses.
 *
 * Most people arriving at a twelve-course catalogue have no way to choose
 * and quietly leave. This asks seven short questions and names three
 * courses, with the reason for each, so the decision stops being a guess.
 *
 * ## Writing an option
 *
 * `label` is three or four words — it is set large and has to be readable
 * at a glance across a column of five. `note` is the sentence underneath
 * that says what the label actually means. Long labels were the first
 * version and read as a questionnaire.
 *
 * ## How an option scores
 *
 * Each option carries a `signal`, and every course is scored against it.
 * Nothing here names a course by slug except as a last resort, so a course
 * added in the admin is scored on the same terms as the rest:
 *
 *   fields   { 'AI / Data': 3 }   weight if course.field matches
 *   levels   { Beginner: 2 }      weight if course.level matches
 *   keywords ['python', 'model']  weight per hit in the course's title,
 *                                 blurb, who-it-is-for and tools, capped at
 *                                 two hits per option
 *   maxHours 8                    the weekly hours the person has; a course
 *                                 that fits gains, one that overruns loses
 *   slugs    { wordpress: 2 }     a direct nudge, used sparingly
 *   reason   'you want to design' shown on the result when this option
 *                                 contributed anything
 *
 * Weights are rough on purpose. The output is a shortlist to talk about,
 * not a verdict, and the panel says so.
 *
 * Plain data only, no imports: this is a content document like about and
 * contact, editable in the admin. See data/team.js for the rule in full.
 */

export const ADVISOR = {
  eyebrow: 'Course finder',
  title: 'Seven questions. Three courses. About a minute.',
  subtitle: 'Nobody should pick a three-month course off a grid of twelve. Answer these and we will name the three worth your time, in order, with the reason for each and the person who teaches it.',
  startLabel: 'Begin',
  resultTitle: 'Your three, in order',
  resultNote: 'A shortlist, not a verdict. If two of them look equally good, say so on a call and we will talk it through — including when the honest answer is none of these.',
  restartLabel: 'Start again',
  contactLabel: 'Talk it through with us',

  questions: [
    {
      id: 'start',
      prompt: 'Where are you starting from?',
      help: 'Be honest. The first month is completely different for each of these.',
      type: 'single',
      options: [
        { id: 'zero', label: 'Complete beginner',
          note: 'I have never written code or opened a design tool',
          signal: { levels: { Beginner: 3 }, reason: 'it starts from zero' } },
        { id: 'tutorials', label: 'A few tutorials in',
          note: 'I have followed along, but could not build it alone',
          signal: { levels: { Beginner: 2 }, reason: 'it assumes no experience' } },
        { id: 'built', label: 'Built small things',
          note: 'A couple of projects of my own, nothing serious',
          signal: { levels: { Beginner: 1, 'Some experience': 2 }, reason: 'it picks up where you are' } },
        { id: 'working', label: 'Already in the industry',
          note: 'I work in tech and want to add a skill',
          signal: { levels: { 'Some experience': 3 }, reason: 'it expects some experience' } },
      ],
    },
    {
      id: 'pull',
      prompt: 'What actually interests you?',
      help: 'Pick up to three. This question counts double.',
      type: 'multi',
      max: 3,
      weight: 2,
      options: [
        { id: 'build', label: 'Building things',
          note: 'Websites and apps people use every day',
          signal: { fields: { Engineering: 3 }, keywords: ['website', 'react', 'javascript'], reason: 'you want to build things people use' } },
        { id: 'look', label: 'How it looks',
          note: 'Layout, type, colour, the feel of a thing',
          signal: { fields: { Design: 3 }, keywords: ['figma', 'typography', 'interface'], reason: 'you care how things look' } },
        { id: 'data', label: 'Answers in data',
          note: 'Spreadsheets, dashboards, what the numbers say',
          signal: { fields: { 'AI / Data': 3 }, keywords: ['sql', 'excel', 'report'], reason: 'you want to work with data' } },
        { id: 'ai', label: 'Teaching machines',
          note: 'Models that predict, classify and write',
          signal: { fields: { 'AI / Data': 3 }, keywords: ['python', 'model', 'machine learning'], reason: 'you are drawn to AI' } },
        { id: 'grow', label: 'Getting attention',
          note: 'Search, ads, and why people click',
          signal: { fields: { Growth: 3 }, keywords: ['ads', 'seo', 'analytics'], reason: 'you want to bring in customers' } },
        { id: 'safe', label: 'Finding the holes',
          note: 'Breaking into systems before someone else does',
          signal: { keywords: ['security', 'networking', 'owasp', 'linux'], reason: 'you want to work in security' } },
        { id: 'shop', label: 'Selling online',
          note: 'A shop that takes payments while you sleep',
          signal: { fields: { Growth: 2 }, keywords: ['shopify', 'store', 'payment', 'woocommerce'], reason: 'you want to sell online' } },
        { id: 'phone', label: 'Apps on a phone',
          note: 'Things that live on a home screen',
          signal: { keywords: ['app store', 'react native', 'mobile'], reason: 'you want to build for phones' } },
      ],
    },
    {
      id: 'goal',
      prompt: 'What would make the three months worth it?',
      type: 'single',
      options: [
        { id: 'job', label: 'A first job',
          note: 'Hired somewhere, doing this for a living',
          signal: { levels: { Beginner: 1 }, keywords: ['portfolio', 'junior', 'employer', 'apply'], reason: 'it ends with work you can show an employer' } },
        { id: 'freelance', label: 'My own clients',
          note: 'Paid work I find and deliver myself',
          signal: { keywords: ['client', 'freelance', 'brief'], slugs: { wordpress: 2, 'graphic-design': 2, 'digital-marketing': 1.5 }, reason: 'the skill is one clients pay for directly' } },
        { id: 'own', label: 'Something of my own',
          note: 'A product or shop I run myself',
          signal: { fields: { Growth: 1.5 }, keywords: ['store', 'launch', 'product', 'online'], slugs: { ecommerce: 2, 'web-development': 1.5 }, reason: 'you can run it yourself afterwards' } },
        { id: 'raise', label: 'Worth more at work',
          note: 'A skill that changes my job where I am',
          signal: { levels: { 'Some experience': 2 }, keywords: ['team', 'production', 'deploy'], reason: 'it adds to what you already do' } },
        { id: 'curious', label: 'Just curiosity',
          note: 'No plan yet, I want to find out if I like it',
          signal: { levels: { Beginner: 1.5 }, reason: 'it is a gentle place to start' } },
      ],
    },
    {
      id: 'enjoy',
      prompt: 'Which of these sounds most like you?',
      type: 'single',
      options: [
        { id: 'puzzle', label: 'I like puzzles',
          note: 'Working a problem until it gives in',
          signal: { fields: { Engineering: 2 }, keywords: ['logic', 'problem'], reason: 'the work is mostly problem solving' } },
        { id: 'spacing', label: 'I notice details',
          note: 'Crooked spacing bothers me more than it should',
          signal: { fields: { Design: 2.5 }, reason: 'it rewards an eye for detail' } },
        { id: 'patterns', label: 'I see patterns',
          note: 'Numbers tell me things other people miss',
          signal: { fields: { 'AI / Data': 2.5 }, reason: 'it is built on reading patterns' } },
        { id: 'people', label: 'I read people',
          note: 'I can tell what will persuade someone',
          signal: { fields: { Growth: 2.5 }, reason: 'it is about changing what people do' } },
        { id: 'apart', label: 'I take things apart',
          note: 'I want to know how the machinery works',
          signal: { keywords: ['security', 'linux', 'networking', 'docker', 'infrastructure'], reason: 'you get to see how the machinery works' } },
      ],
    },
    {
      id: 'time',
      prompt: 'How many hours a week can you really give it?',
      help: 'The hours we publish are the hours it takes. A course you cannot keep up with is worse than no course.',
      type: 'single',
      options: [
        { id: 'lt6',  label: 'Under 6 hours',   note: 'Evenings, when nothing else comes up',  signal: { maxHours: 6,  reason: 'it fits the hours you have' } },
        { id: 'h68',  label: '6 to 8 hours',    note: 'An hour most days, or one long sitting', signal: { maxHours: 8,  reason: 'it fits the hours you have' } },
        { id: 'h812', label: '8 to 12 hours',   note: 'This is the main thing outside work',    signal: { maxHours: 12, reason: 'it fits the hours you have' } },
        { id: 'any',  label: 'As much as it takes', note: 'I have cleared the time for it',     signal: { maxHours: 99, reason: 'you have the hours it asks for' } },
      ],
    },
    {
      id: 'maths',
      prompt: 'How do you feel about maths?',
      type: 'single',
      options: [
        { id: 'avoid', label: 'I would rather not',
          note: 'It is the part I have always avoided',
          signal: { fields: { 'AI / Data': -2 }, keywords: ['design', 'content', 'store'], reason: 'there is almost no maths in it' } },
        { id: 'basics', label: 'Fine with basics',
          note: 'Percentages and averages do not scare me',
          signal: { slugs: { 'data-analyst': 1.5 }, reason: 'the maths stays at the level you are comfortable with' } },
        { id: 'enjoy', label: 'I enjoy it',
          note: 'Statistics and algebra are a draw, not a cost',
          signal: { fields: { 'AI / Data': 2.5 }, reason: 'you will use the maths you enjoy' } },
      ],
    },
    {
      id: 'earn',
      prompt: 'How soon does this need to pay for itself?',
      type: 'single',
      options: [
        { id: 'fast', label: 'As soon as I finish',
          note: 'I need this earning inside a few months',
          signal: { slugs: { wordpress: 2, 'graphic-design': 1.5, ecommerce: 1.5, 'digital-marketing': 1.5, 'data-analyst': 1 }, reason: 'it is one of the quicker routes to paid work' } },
        { id: 'year', label: 'Within a year',
          note: 'I can build towards it steadily',
          signal: { levels: { Beginner: 1 }, reason: 'it builds towards steady work rather than a quick win' } },
        { id: 'invest', label: 'I am playing long',
          note: 'Depth matters more to me than speed',
          signal: { fields: { 'AI / Data': 1.5, Engineering: 1 }, levels: { 'Some experience': 1 }, reason: 'it goes deep rather than fast' } },
      ],
    },
  ],
}
