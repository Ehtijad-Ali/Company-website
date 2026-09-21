import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, BarChart2, RotateCcw } from 'lucide-react'
import { useContent } from '../../context/ContentContext'
import { useCourses, useTeam } from '../../hooks/useSiteContent'
import { recommend, rankCourses, confidence } from '../../lib/advisor'
import { ImagePlate } from '../ui/EditorialImage'
import { img, TEXTURE, courseImage } from '../../data/imagery'
import { E } from '../../lib/motion'
import { avatarFallback } from '../../lib/avatar'

/**
 * The course advisor.
 *
 * Twelve courses is enough to stall someone who is already nervous about
 * committing three months, and a grid gives them no way in: every card
 * looks equally plausible. This asks seven short questions and names three
 * courses in order, each with the reason it is there.
 *
 * It is a panel inside the page container, holding one question at
 * headline size on a textured plate with the answers in a column beside
 * it. The first version stacked question and answers inside a small card
 * and read as a form; the second ran edge to edge and broke the page's
 * measure.
 *
 * Two things it deliberately does not do:
 *
 *  - It does not ask for an email. Gating a recommendation behind a form is
 *    how these things earn their reputation, and someone who wants to talk
 *    has a button at the end.
 *  - It does not claim a percentage. It says which of your answers each
 *    course responded to, and how close the top two were, because seven
 *    questions cannot support "97% match".
 *
 * The questions come from the content API (`advisor`), so they are editable
 * in the admin, and the courses are the live catalogue — a course added
 * there is matched on its own field, level, hours and tools without anyone
 * touching the scoring.
 */

const CONFIDENCE_NOTE = {
  clear:   'One of these is a clear fit.',
  leaning: 'The first is ahead, though the second is worth a look.',
  close:   'These three are close. Any of them would work.',
  none:    '',
}

/** One answer. Label large, the sentence that explains it underneath. */
function Option({ option, selected, multi, index, onPick, reduce }) {
  return (
    <motion.button
      type="button"
      className={`advisor__opt${selected ? ' is-on' : ''}`}
      aria-pressed={selected}
      onClick={() => onPick(option.id)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 + index * 0.05, duration: 0.45, ease: E }}
    >
      <span className="advisor__mark" aria-hidden="true">
        {selected ? <Check /> : <span className="advisor__mark-dot" />}
      </span>
      <span className="advisor__opt-body">
        <span className="advisor__opt-label">{option.label}</span>
        {option.note && <span className="advisor__opt-note">{option.note}</span>}
      </span>
      <ArrowUpRight className="advisor__opt-go" aria-hidden="true" />
    </motion.button>
  )
}

/** One recommended course. The first is set larger than the other two. */
function Result({ result, rank, mentor }) {
  const { course, reasons, matches, answered } = result
  const lead = rank === 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * rank, duration: 0.55, ease: E }}
      className={`advisor__result${lead ? ' is-lead' : ''}`}
    >
      <Link to={`/courses/${course.slug}`} className="advisor__result-link">
        {/* Only the recommendation carries a picture. Three images side by
            side would flatten the ranking back out again. */}
        {lead && (
          <div className="advisor__result-media">
            <img src={courseImage(course, 720, 380)} alt="" loading="lazy" decoding="async"
              onError={e => { e.currentTarget.style.display = 'none' }} />
          </div>
        )}

        <div className="advisor__result-head">
          <span className="advisor__rank">{lead ? 'Best fit' : `Also worth it · 0${rank + 1}`}</span>
          <ArrowUpRight className="advisor__result-go" aria-hidden="true" />
        </div>

        <h4 className="advisor__result-title">{course.title}</h4>
        <p className="advisor__result-blurb">{course.blurb}</p>

        {reasons.length > 0 && (
          <ul className="advisor__reasons">
            {reasons.slice(0, lead ? 3 : 2).map(r => (
              <li key={r}><Check aria-hidden="true" /><span>Because {r}</span></li>
            ))}
          </ul>
        )}

        <div className="advisor__result-foot">
          <span><Clock aria-hidden="true" /> {course.commitment}</span>
          <span><BarChart2 aria-hidden="true" /> {course.level}</span>
          <span className="advisor__match">{matches} of your {answered} answers</span>
        </div>

        {mentor && (
          <div className="course-mentor">
            <img src={mentor.img} alt="" onError={avatarFallback(mentor.name, 120)} />
            <span>Taught by {mentor.name}</span>
          </div>
        )}

        <span className="advisor__result-cta">
          {lead ? 'Read the three-month plan' : 'See the plan'}
          <ArrowRight aria-hidden="true" />
        </span>
      </Link>
    </motion.article>
  )
}

export default function CourseAdvisor({ onTalk }) {
  const advisor = useContent('advisor')
  const courses = useCourses()
  const team = useTeam()
  const reduce = useReducedMotion()

  const questions = advisor.questions ?? []
  const [phase, setPhase] = useState('intro')   // intro | asking | matching | done
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [back, setBack] = useState(false)       // direction, for the slide

  const question = questions[index]
  const answeredIds = questions.filter(q => {
    const a = answers[q.id]
    return Array.isArray(a) ? a.length > 0 : a != null
  })
  const answeredCount = answeredIds.length

  const results = useMemo(
    () => recommend(courses, questions, answers, 3),
    [courses, questions, answers],
  )

  /* A running line under the question: enough to show the thing is
     listening, not enough to pre-empt the answer. */
  const leader = useMemo(() => {
    if (answeredCount < 2) return null
    const [top] = rankCourses(courses, questions, answers)
    return top && top.score > 0 ? top.course : null
  }, [courses, questions, answers, answeredCount])

  const selected = question ? answers[question.id] : undefined
  const isMulti = question?.type === 'multi'
  const hasAnswer = Array.isArray(selected) ? selected.length > 0 : selected != null

  const go = (next, goingBack = false) => {
    setBack(goingBack)
    /* A held beat before the result. Not a fake loading bar — the scoring
       is instant — but an answer that appears the same frame as the last
       click reads as a lookup table, and this one is worth reading. */
    if (next >= questions.length) setPhase(reduce ? 'done' : 'matching')
    else setIndex(Math.max(0, next))
  }

  useEffect(() => {
    if (phase !== 'matching') return
    const t = window.setTimeout(() => setPhase('done'), 900)
    return () => window.clearTimeout(t)
  }, [phase])

  /* Number keys pick an answer, Enter moves on. Anyone who fills in a lot
     of forms will try it, and it costs nothing to support. */
  useEffect(() => {
    if (phase !== 'asking' || !question) return
    const onKey = e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const n = Number(e.key)
      if (n >= 1 && n <= (question.options?.length ?? 0)) {
        e.preventDefault()
        pick(question.options[n - 1].id)
        return
      }
      if (e.key === 'Enter' && hasAnswer) { e.preventDefault(); go(index + 1) }
      if (e.key === 'Backspace' && index > 0) { e.preventDefault(); go(index - 1, true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const pick = optionId => {
    if (!question) return
    if (isMulti) {
      const current = Array.isArray(selected) ? selected : []
      const max = question.max ?? question.options.length
      const next = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        /* Choosing a fourth when three are allowed drops the oldest rather
           than silently doing nothing, which reads as a broken button. */
        : [...current, optionId].slice(-max)
      setAnswers(a => ({ ...a, [question.id]: next }))
      return
    }
    setAnswers(a => ({ ...a, [question.id]: optionId }))
    /* Single-answer questions move on by themselves — after a beat, so the
       selection is visible before the panel changes under you. */
    window.setTimeout(() => go(index + 1), reduce ? 0 : 280)
  }

  const restart = () => {
    setAnswers({})
    setIndex(0)
    setBack(false)
    setPhase('intro')
  }

  /** The chips on the results screen: what it based the answer on. */
  const summary = questions.flatMap(q => {
    const picked = answers[q.id]
    if (picked == null) return []
    const ids = Array.isArray(picked) ? picked : [picked]
    return ids
      .map(id => (q.options ?? []).find(o => o.id === id))
      .filter(Boolean)
      .map(o => ({ key: `${q.id}-${o.id}`, label: o.label, questionIndex: questions.indexOf(q) }))
  })

  if (questions.length === 0) return null

  const slide = dir => (reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: dir ? -28 : 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: dir ? 28 : -28 },
      })

  return (
    <section className={`advisor advisor--${phase}`} aria-label="Course finder">
      {/* The same plate treatment the editorial sections use, so this reads
          as part of the site rather than as an embedded tool. */}
      <ImagePlate src={img(TEXTURE.stucco, 1600, 1000)} opacity={0.5} />

      <div className="advisor__inner">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Intro ───────────────────────────────────────────── */}
          {phase === 'intro' && (
            <motion.div key="intro" {...slide(false)} transition={{ duration: 0.45, ease: E }}
              className="advisor__intro">
              <span className="eyebrow advisor__eyebrow">{advisor.eyebrow}</span>
              <h2 className="advisor__title">{advisor.title}</h2>
              <p className="advisor__sub">{advisor.subtitle}</p>

              <div className="advisor__intro-foot">
                <button type="button" className="btn btn-primary micro-click advisor__begin"
                  onClick={() => setPhase('asking')}>
                  {advisor.startLabel ?? 'Begin'} <ArrowRight className="w-4 h-4" />
                </button>
                <span className="advisor__fineprint">
                  {questions.length} questions · no email, no sign-up
                </span>
              </div>
            </motion.div>
          )}

          {/* ── Questions ───────────────────────────────────────── */}
          {phase === 'asking' && question && (
            <motion.div key={question.id} {...slide(back)} transition={{ duration: 0.4, ease: E }}
              className="advisor__ask">

              {/* Left: where you are and what is being asked */}
              <div className="advisor__prompt">
                <div className="advisor__steps" aria-hidden="true">
                  {questions.map((q, i) => (
                    <span
                      key={q.id}
                      className={`advisor__step${i === index ? ' is-now' : ''}${i < index ? ' is-done' : ''}`}
                    />
                  ))}
                </div>
                <span className="eyebrow advisor__count">
                  Question {String(index + 1).padStart(2, '0')}
                  <span className="advisor__of"> of {String(questions.length).padStart(2, '0')}</span>
                </span>

                <h3 className="advisor__q" id={`advisor-q-${question.id}`}>{question.prompt}</h3>
                {question.help && <p className="advisor__help">{question.help}</p>}

                {leader && (
                  <p className="advisor__hint" aria-live="polite">
                    <span className="advisor__pulse" aria-hidden="true" />
                    Leaning towards <strong>{leader.title}</strong>
                  </p>
                )}
              </div>

              {/* Right: the answers */}
              <div className="advisor__answers">
                <div className="advisor__opts" role="group" aria-labelledby={`advisor-q-${question.id}`}>
                  {(question.options ?? []).map((o, i) => (
                    <Option
                      key={o.id}
                      option={o}
                      index={i}
                      multi={isMulti}
                      reduce={reduce}
                      selected={Array.isArray(selected) ? selected.includes(o.id) : selected === o.id}
                      onPick={pick}
                    />
                  ))}
                </div>

                <div className="advisor__foot">
                  <button type="button" className="advisor__back"
                    onClick={() => (index === 0 ? restart() : go(index - 1, true))}>
                    <ArrowLeft aria-hidden="true" /> {index === 0 ? 'Back to the start' : 'Previous'}
                  </button>

                  <span className="advisor__keys" aria-hidden="true">
                    Press <kbd>1</kbd>–<kbd>{question.options?.length ?? 1}</kbd>
                    {isMulti && <> then <kbd>Enter</kbd></>}
                  </span>

                  {isMulti && (
                    <button type="button" className="btn btn-primary micro-click advisor__next"
                      disabled={!hasAnswer} onClick={() => go(index + 1)}>
                      {index === questions.length - 1 ? 'See my three' : 'Next'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── The beat before the answer ──────────────────────── */}
          {phase === 'matching' && (
            <motion.div key="matching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }} className="advisor__matching" aria-live="polite">
              <span className="advisor__pulse" aria-hidden="true" />
              <p>Matching you against {courses.length} courses…</p>
            </motion.div>
          )}

          {/* ── Results ─────────────────────────────────────────── */}
          {phase === 'done' && (
            <motion.div key="done" {...slide(false)} transition={{ duration: 0.45, ease: E }}>
              <div className="advisor__done-head">
                <div>
                  <span className="eyebrow advisor__eyebrow">{advisor.resultTitle ?? 'Your three'}</span>
                  <p className="advisor__confidence">{CONFIDENCE_NOTE[confidence(results)]}</p>
                </div>
                <button type="button" className="advisor__back" onClick={restart}>
                  <RotateCcw aria-hidden="true" /> {advisor.restartLabel ?? 'Start again'}
                </button>
              </div>

              {/* What it went on. Each chip goes back to that question, so a
                  wrong answer is one click to fix rather than a restart. */}
              {summary.length > 0 && (
                <div className="advisor__summary">
                  {summary.map(s => (
                    <button key={s.key} type="button" className="advisor__summary-chip"
                      onClick={() => { setPhase('asking'); setIndex(s.questionIndex); setBack(true) }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {results.length > 0 ? (
                <div className="advisor__results">
                  {results.map((r, i) => (
                    <Result
                      key={r.course.slug}
                      result={r}
                      rank={i}
                      mentor={team.find(m => m.slug === r.course.mentor)}
                    />
                  ))}
                </div>
              ) : (
                <p className="advisor__sub">
                  Nothing in the catalogue lines up with those answers, which is worth a
                  conversation rather than a guess.
                </p>
              )}

              <div className="advisor__done-foot">
                <p className="advisor__note">{advisor.resultNote}</p>
                {onTalk && (
                  <button type="button" className="btn btn-secondary micro-click" onClick={onTalk}>
                    {advisor.contactLabel ?? 'Talk it through with us'} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
