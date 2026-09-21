import React, { useEffect, useState } from 'react'

/**
 * Types each word out, holds it, deletes it, moves on. Used once, in the
 * hero's standfirst, to cycle through what the studio builds.
 */
export default function TypingText({ words, speed = 75, pauseMs = 1800, className = '', style }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!words?.length) return

    const current = words[wordIdx]

    if (!deleting && charIdx <= current.length) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx))
        setCharIdx(c => c + 1)
      }, charIdx === 0 ? pauseMs / 3 : speed)
      return () => clearTimeout(t)
    }

    if (!deleting && charIdx > current.length) {
      const t = setTimeout(() => setDeleting(true), pauseMs)
      return () => clearTimeout(t)
    }

    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => {
        setDisplay(current.slice(0, charIdx))
        setCharIdx(c => c - 1)
      }, speed / 2)
      return () => clearTimeout(t)
    }

    if (deleting && charIdx < 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
      setCharIdx(0)
    }
  }, [charIdx, deleting, wordIdx, words, speed, pauseMs])

  return (
    <span className={className} style={style}>
      {display}
      <span className="typing-cursor" aria-hidden="true" />
    </span>
  )
}
