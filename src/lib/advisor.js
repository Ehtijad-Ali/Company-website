/**
 * Scoring for the course advisor.
 *
 * Pure functions over (courses, questions, answers) — no React, no content
 * fetching — so the matching can be reasoned about and tested on its own.
 *
 * The scoring is deliberately shallow: a handful of weighted signals summed
 * per course. Anything cleverer would be false precision on seven questions,
 * and the panel presents the output as a shortlist to argue with rather
 * than an answer.
 *
 * Courses are matched on their own fields — field, level, commitment, tools,
 * blurb — so a course added through the admin is scored like every other
 * one without anybody editing this file.
 */

/** Weight per keyword hit, and the most an option can earn from keywords. */
const KEYWORD_WEIGHT = 1.25
const KEYWORD_CAP = 2

/** What a course that overruns the person's available hours gives up. */
const OVERRUN_PENALTY = 1.5
const FITS_HOURS_BONUS = 2

/**
 * The upper bound of a course's weekly hours: "8 to 10 hours a week" → 10,
 * "6 hours a week" → 6. Returns null when there is no number to find, which
 * scores as neutral rather than as "free".
 */
export const weeklyHours = commitment => {
  const numbers = String(commitment ?? '').match(/\d+/g)
  if (!numbers) return null
  return Math.max(...numbers.map(Number))
}

/**
 * What a keyword is matched against: how the course describes itself, not
 * every word in its month plan. Nearly every course mentions security or
 * clients somewhere in twelve weeks of topics, and matching on that put
 * WordPress in front of someone who asked for security work.
 */
const haystack = course => [
  course.title,
  course.field,
  course.blurb,
  course.forWho,
  (course.tools ?? []).join(' '),
].join(' ').toLowerCase()

/** Every option the answers selected, paired with its question. */
const selectedOptions = (questions, answers) =>
  questions.flatMap(q => {
    const picked = answers[q.id]
    if (picked == null) return []
    const ids = Array.isArray(picked) ? picked : [picked]
    return ids
      .map(id => (q.options ?? []).find(o => o.id === id))
      .filter(Boolean)
      .map(option => ({ question: q, option }))
  })

/** What one option contributes to one course, and why. */
function scoreOption(course, option, text) {
  const s = option.signal ?? {}
  let score = 0
  let matched = false

  const fieldWeight = s.fields?.[course.field]
  if (fieldWeight) {
    score += fieldWeight
    if (fieldWeight > 0) matched = true
  }

  const levelWeight = s.levels?.[course.level]
  if (levelWeight) {
    score += levelWeight
    if (levelWeight > 0) matched = true
  }

  const slugWeight = s.slugs?.[course.slug]
  if (slugWeight) {
    score += slugWeight
    if (slugWeight > 0) matched = true
  }

  if (s.keywords?.length) {
    const hits = s.keywords.filter(k => text.includes(String(k).toLowerCase())).length
    if (hits) {
      score += Math.min(hits, KEYWORD_CAP) * KEYWORD_WEIGHT
      matched = true
    }
  }

  if (s.maxHours != null) {
    const hours = weeklyHours(course.commitment)
    if (hours != null) {
      if (hours <= s.maxHours) {
        score += FITS_HOURS_BONUS
        matched = true
      } else {
        /* Not a disqualification — some people will stretch — but a course
           that asks for more time than someone has is the single most
           common reason they stop turning up. */
        score -= OVERRUN_PENALTY
      }
    }
  }

  return { score, matched }
}

/**
 * Rank every course against the answers so far.
 *
 * @returns {Array<{course, score, matches, answered, reasons: string[]}>}
 *   sorted best first. `matches` is how many of the answered questions the
 *   course responded to, which is what the UI reports — a percentage would
 *   imply an accuracy these seven questions do not have.
 */
export function rankCourses(courses, questions, answers) {
  const answered = questions.filter(q => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : a != null
  })
  const chosen = selectedOptions(answered, answers)

  const ranked = courses.map(course => {
    const text = haystack(course)
    const reasons = []
    const matchedQuestions = new Set()
    let score = 0

    for (const { question, option } of chosen) {
      const weight = question.weight ?? 1
      const { score: raw, matched } = scoreOption(course, option, text)
      score += raw * weight
      if (matched) {
        matchedQuestions.add(question.id)
        if (option.signal?.reason) reasons.push(option.signal.reason)
      }
    }

    return {
      course,
      score,
      matches: matchedQuestions.size,
      answered: answered.length,
      /* Deduplicated, best first, and only the few that fit on a card —
         six bullet points read as a sales page, not a recommendation. */
      reasons: [...new Set(reasons)].slice(0, 3),
    }
  })

  /* Sort is stable in every engine we target, so courses that tie keep the
     catalogue's own order rather than shuffling between renders. */
  return ranked.sort((a, b) => b.score - a.score)
}

/** The top `count`, dropping anything that matched nothing at all. */
export function recommend(courses, questions, answers, count = 3) {
  return rankCourses(courses, questions, answers)
    .filter(r => r.matches > 0 && r.score > 0)
    .slice(0, count)
}

/**
 * How confident the shortlist is, for the line above the results.
 * A clear winner reads differently from three courses within a point of
 * each other, and saying so is more useful than pretending otherwise.
 */
export function confidence(results) {
  if (results.length === 0) return 'none'
  if (results.length === 1) return 'clear'
  const [first, second] = results
  const gap = first.score - second.score
  if (gap >= 4) return 'clear'
  if (gap >= 1.5) return 'leaning'
  return 'close'
}
