import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiClient } from '../services/apiClient'
import { FALLBACK, SECTION_KEYS, mergeContent } from '../services/content'

/**
 * Site content, loaded once per page load.
 *
 * One request fetches every section rather than one per component — seven
 * round trips to render the home page would cost more than the payload
 * itself. Sections start on their bundled fallback and are replaced when
 * the response lands, so nothing renders empty in the meantime.
 */
const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK)
  const [sources, setSources] = useState(
    () => Object.fromEntries(SECTION_KEYS.map(k => [k, 'fallback']))
  )
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let live = true
    apiClient.content.all()
      .then(res => {
        if (!live) return
        const { merged, sources } = mergeContent(res?.content)
        setContent(merged)
        setSources(sources)
        setStatus('ready')
      })
      .catch(err => {
        if (!live) return
        /* Not an error the visitor needs to see: the page is already
           rendering the content that shipped with the build. */
        if (import.meta.env?.DEV) console.debug('[content] falling back to bundled copy:', err.message)
        setStatus('fallback')
      })
    return () => { live = false }
  }, [])

  const value = useMemo(() => ({ content, sources, status }), [content, sources, status])
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

/**
 * Read one section.
 *
 * Safe to call outside the provider — it returns the bundled fallback —
 * so a component can be rendered in isolation, or in a test, without one.
 *
 * @param {keyof FALLBACK} key
 * @returns the section's content: an array for collections, an object for documents
 */
export function useContent(key) {
  const ctx = useContext(ContentContext)
  return (ctx ? ctx.content[key] : FALLBACK[key]) ?? FALLBACK[key]
}

/** Everything at once, for the admin and for anything that needs several. */
export function useAllContent() {
  const ctx = useContext(ContentContext)
  return ctx ?? { content: FALLBACK, sources: {}, status: 'fallback' }
}
