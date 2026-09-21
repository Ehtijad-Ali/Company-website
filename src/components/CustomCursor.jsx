import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x: -100, y: -100 })
  const cur  = useRef({ x: -100, y: -100 })
  const raf  = useRef(null)

  useEffect(() => {
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      d.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
    }

    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.13
      cur.current.y += (pos.current.y - cur.current.y) * 0.13
      r.style.transform = `translate(${cur.current.x}px, ${cur.current.y}px) translate(-50%, -50%)`
      raf.current = requestAnimationFrame(tick)
    }

    /* One listener on the document, not one per element. The old version
       bound mouseenter to whatever links existed three seconds after the
       site first loaded, so every link on a page reached later — another
       route, a filtered grid, the chat — never grew the ring. Delegating
       means a link rendered at any time is covered. */
    const TARGETS = 'a, button, [data-cursor], [role="button"], label, select, summary'
    const over = (e) => {
      r.classList.toggle('hov', !!e.target.closest?.(TARGETS))
    }
    /* Leaving the window drops the hover, or the ring stays swollen at the
       edge until the pointer comes back. */
    const out = (e) => { if (!e.relatedTarget) r.classList.remove('hov') }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    document.addEventListener('pointerout', out, { passive: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div id="cur-dot"  ref={dot}  />
      <div id="cur-ring" ref={ring} />
    </>
  )
}
