/**
 * Scripted answers for the chat widget.
 *
 * This is the floor, not the ceiling: every answer here works with no API key,
 * no backend, and no per-message cost, so the widget stays useful on the static
 * deploy. When the Claude-backed endpoint is reachable, `chatClient` prefers it
 * and these serve as the fallback.
 *
 * Every fact below is drawn from copy already published on the site (FAQ,
 * Services, Contact). Keep them in sync — and keep them in sync with the
 * SYSTEM_PROMPT in server/app.py, which states the same facts to Claude.
 */

export const CONTACT = {
  whatsapp: 'https://wa.me/923110868172',
  whatsappLabel: '+92 311 0868172',
}

/**
 * Intents are matched by keyword score, best match wins. `weight` breaks ties
 * for the broader topics so a question mentioning two subjects lands on the
 * more specific one.
 */
const INTENTS = [
  {
    id: 'greeting',
    weight: 0,
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'salam', 'assalam'],
    answer: "Hello, I'm the CodeNode assistant. I can answer questions about our services, timelines, pricing and process. What are you working on?",
    chips: ['What do you build?', 'How much does it cost?', 'How long does it take?'],
  },
  {
    id: 'services',
    weight: 1,
    keywords: ['service', 'services', 'what do you do', 'what do you build', 'offer', 'capabilities', 'help with', 'specialise', 'specialize'],
    answer:
      'We work across eight areas: web development, AI & machine learning, UI/UX design, mobile apps, cloud & DevOps, digital marketing, cybersecurity, and performance engineering.\n\nMost engagements combine two or three of those: a platform build with the design and infrastructure that go around it.',
    chips: ['Tell me about AI work', 'What tech stack?', 'Start a project'],
  },
  {
    id: 'ai',
    weight: 2,
    keywords: ['ai', 'ml', 'machine learning', 'llm', 'gpt', 'claude', 'chatbot', 'nlp', 'computer vision', 'predictive', 'automation'],
    answer:
      "AI integration is one of our fastest-growing service lines: LLM-powered features through to full ML pipelines, shipped to production for clients in fintech, health and e-commerce.\n\nIn practice that's usually NLP, computer vision, predictive analytics, or intelligent automation wired into a product you already run.",
    chips: ['How long would that take?', 'Start a project'],
  },
  {
    id: 'pricing',
    weight: 2,
    keywords: ['price', 'pricing', 'cost', 'budget', 'quote', 'how much', 'rate', 'expensive', 'afford', 'charge'],
    answer:
      "Budgets start at $2,000 for targeted projects, and scale from there with scope.\n\nWe use fixed-price for well-scoped work and time & materials for exploratory or evolving work, and we'll recommend whichever protects both sides after a discovery call.",
    chips: ['Book a discovery call', 'How long does it take?'],
  },
  {
    id: 'timeline',
    weight: 2,
    keywords: ['how long', 'timeline', 'time', 'duration', 'deadline', 'fast', 'quick', 'when', 'weeks', 'months', 'delivery'],
    answer:
      'It depends on scope. A focused landing page runs 2 to 3 weeks; a full SaaS platform typically takes 3 to 6 months.\n\nWe define clear milestones upfront, so you know what lands when rather than waiting for a big reveal.',
    chips: ['How much does it cost?', 'What is your process?'],
  },
  {
    id: 'process',
    weight: 1,
    keywords: ['process', 'how do you work', 'workflow', 'methodology', 'approach', 'steps', 'sprint', 'discovery'],
    answer:
      "We're engineers who design and designers who understand code, so there's no handoff gap between the two.\n\nEvery project starts with discovery and a milestone plan, then runs in sprints with working software you can look at throughout, not a reveal at the end.",
    chips: ['Who is on the team?', 'Start a project'],
  },
  {
    id: 'stack',
    weight: 2,
    keywords: ['stack', 'tech', 'technology', 'framework', 'react', 'next', 'node', 'python', 'database', 'aws', 'language', 'built with'],
    answer:
      "Stack-agnostic but opinionated. For most projects: React or Next.js on the frontend, Node.js or Python on the backend, PostgreSQL or MongoDB for data, and AWS or GCP for infrastructure.\n\nWe go where the problem leads rather than where the résumé does.",
    chips: ['Can you take over our codebase?', 'Start a project'],
  },
  {
    id: 'existing-code',
    weight: 3,
    keywords: ['existing', 'legacy', 'take over', 'inherit', 'rescue', 'our codebase', 'current site', 'current app', 'migrate', 'rewrite'],
    answer:
      "Yes, we've taken over plenty of projects mid-flight.\n\nWe start with a thorough audit and an honest assessment, then agree a remediation plan before touching a line of code. Sometimes that plan is 'fix this'; sometimes it's 'this needs replacing', and we'll say so.",
    chips: ['Book a discovery call', 'How much does it cost?'],
  },
  {
    id: 'support',
    weight: 2,
    keywords: ['support', 'maintenance', 'after launch', 'post launch', 'warranty', 'retainer', 'ongoing', 'bug', 'sla'],
    answer:
      'Every project includes a 30-day warranty window after launch.\n\nBeyond that we offer monthly retainers covering maintenance, feature work and performance monitoring, and most clients keep one running.',
    chips: ['How much does it cost?', 'Start a project'],
  },
  {
    id: 'startups',
    weight: 2,
    keywords: ['startup', 'startups', 'enterprise', 'small business', 'mvp', 'early stage', 'founder', 'seed', 'solo'],
    answer:
      'Both, genuinely. Engagement models run from lean MVP sprints for early-stage startups through to ongoing retainers for larger teams.\n\nTargeted projects start around $2,000.',
    chips: ['How long does an MVP take?', 'Book a discovery call'],
  },
  {
    id: 'team',
    weight: 2,
    keywords: ['team', 'who are you', 'people', 'employees', 'staff', 'company', 'about', 'founded', 'where are you'],
    answer:
      "We're a small senior team, and every person contributes to both vision and execution, which is why there are fewer revisions and no handoff chaos.\n\nEach person also has their own profile with rates, skills and past work, and can be engaged individually.",
    chips: ['Can I hire one person?', 'Browse the team', 'What is your process?'],
  },
  {
    id: 'hire-individual',
    weight: 3,
    keywords: ['hire', 'hourly', 'per hour', 'individual', 'one person', 'freelance', 'freelancer', 'contractor', 'interview', 'book someone', 'specific person', 'rate', 'rates', 'developer for', 'designer for', 'augment'],
    answer:
      "Yes, every specialist on the team can be engaged directly, by the hour, for a sprint, or embedded in your team.\n\nRates run from $20/hr for research through to $50/hr for strategy work. Each profile shows the rate, current availability, skills and selected work, and has a 'Request an interview' button that reaches us directly.",
    chips: ['Browse the team', 'How much does it cost?'],
  },
  {
    id: 'contact',
    weight: 3,
    keywords: ['contact', 'talk', 'call', 'email', 'reach', 'get in touch', 'book', 'meeting', 'consultation', 'start a project', 'hire you', 'whatsapp', 'phone'],
    answer:
      "Happiest to talk properly. The contact form is the quickest route. Tell us what you're building and we'll come back within one business day.\n\nOr message us on WhatsApp at " + CONTACT.whatsappLabel + ' if that suits you better.',
    chips: ['Open the contact form', 'Message on WhatsApp'],
  },
  {
    id: 'portfolio',
    weight: 2,
    keywords: ['portfolio', 'work', 'case study', 'examples', 'projects', 'clients', 'previous', 'showcase', 'built before'],
    answer:
      "The portfolio page has selected work across fintech, health, e-commerce and SaaS.\n\nIf you tell me roughly what you're building, I can point you at the closest thing we've shipped.",
    chips: ['See the portfolio', 'What do you build?'],
  },
  {
    id: 'thanks',
    weight: 0,
    keywords: ['thanks', 'thank you', 'cheers', 'appreciate', 'great', 'perfect', 'awesome', 'bye', 'goodbye'],
    answer: "Any time. If you'd like to take it further, the contact form is the fastest way to reach a human here.",
    chips: ['Open the contact form'],
  },
]

const FALLBACK = {
  id: 'fallback',
  answer:
    "I don't have a scripted answer for that one. I cover services, pricing, timelines, process, tech stack and support.\n\nFor anything more specific, the contact form reaches a human who can answer properly, usually within a business day.",
  chips: ['What do you build?', 'How much does it cost?', 'Open the contact form'],
}

export const OPENING_MESSAGE = {
  role: 'assistant',
  content:
    "Hi, I'm the CodeNode assistant. Ask me about our services, timelines, pricing or how we work.",
  chips: ['What do you build?', 'How much does it cost?', 'How long does it take?'],
}

/**
 * Scores each intent by how many of its keywords appear in the question.
 * Longer keywords score higher, so "how much" beats a stray "how".
 */
const GREETING = INTENTS.find(i => i.id === 'greeting')
const GREETING_RE = new RegExp(`^(${GREETING.keywords.join('|')})\\b`)

export function matchIntent(input) {
  const text = ` ${input.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ')} `

  // Greeting tokens are too short to clear the keyword-score threshold below,
  // so match them up front — but only on a short opening line, so "hey, how
  // much does a rebuild cost?" still routes to pricing.
  const trimmed = text.trim()
  if (trimmed.length <= 24 && GREETING_RE.test(trimmed)) return GREETING

  let best = null
  let bestScore = 0

  for (const intent of INTENTS) {
    let score = 0
    for (const keyword of intent.keywords) {
      if (text.includes(` ${keyword} `) || text.includes(`${keyword} `) || text.includes(` ${keyword}`)) {
        score += keyword.length + intent.weight * 3
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }

  // A single weak keyword hit is usually a coincidence, not an intent.
  return bestScore >= 6 ? best : FALLBACK
}

export function scriptedReply(input) {
  const intent = matchIntent(input)
  return { content: intent.answer, chips: intent.chips ?? [], intent: intent.id }
}
