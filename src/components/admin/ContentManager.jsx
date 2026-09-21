import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, Loader, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import { useAuth } from '../../context/AuthContext'
import { SECTIONS, SECTION_KEYS, FALLBACK } from '../../services/content'

/**
 * Editor for the site's content sections.
 *
 * Each section is either a collection (team, services, portfolio, posts,
 * courses) edited one record at a time, or a single document (about,
 * contact) edited whole.
 *
 * Records are edited as a form of their scalar fields plus the full JSON,
 * both bound to one draft object, so a change in either shows up in the
 * other. The JSON is there because these records are nested and irregular —
 * a course has three months, each with a list of topics — and a generated
 * form deep enough to cover that would be harder to use than the JSON it
 * replaced. The scalar fields cover the edits that actually happen often:
 * a role, a rate, a price, a headline.
 *
 * Saving writes through the API and re-reads the section, so what is on
 * screen afterwards is what the site will serve, not what was typed.
 */

const isScalar = v => ['string', 'number', 'boolean'].includes(typeof v)

/** A record's headline, for the list: whichever of these it has. */
const titleOf = item => item?.name ?? item?.title ?? item?.slug ?? '(untitled)'

function Field({ label, value, onChange }) {
  const type = typeof value
  if (type === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
        {label}
      </label>
    )
  }
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest mb-1"
        style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <input
        className="input"
        type={type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </label>
  )
}

/** Form + JSON for one record or one document, both bound to `draft`. */
function DraftEditor({ draft, setDraft }) {
  const [json, setJson] = useState(() => JSON.stringify(draft, null, 2))
  const [jsonError, setJsonError] = useState('')

  /* When the form edits a field, re-serialise. When the JSON is edited it
     is the source, so it is not overwritten mid-typing. */
  const [editingJson, setEditingJson] = useState(false)
  useEffect(() => {
    if (!editingJson) setJson(JSON.stringify(draft, null, 2))
  }, [draft, editingJson])

  const scalars = Object.entries(draft).filter(([, v]) => isScalar(v))

  const onJson = text => {
    setJson(text)
    try {
      const parsed = JSON.parse(text)
      if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
        setJsonError('Must be a JSON object')
        return
      }
      setJsonError('')
      setDraft(parsed)
    } catch (err) {
      setJsonError(err.message)
    }
  }

  return (
    <div className="space-y-5">
      {scalars.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {scalars.map(([k, v]) => (
            <Field key={k} label={k} value={v}
              onChange={next => setDraft({ ...draft, [k]: next })} />
          ))}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--text-secondary)' }}>
            Full record (JSON)
          </span>
          {jsonError && (
            <span className="text-xs" style={{ color: 'var(--text-red)' }}>{jsonError}</span>
          )}
        </div>
        <textarea
          className="input font-mono"
          style={{ minHeight: 280, fontSize: '0.75rem', lineHeight: 1.6, resize: 'vertical' }}
          spellCheck={false}
          value={json}
          onFocus={() => setEditingJson(true)}
          onBlur={() => setEditingJson(false)}
          onChange={e => onJson(e.target.value)}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Lists and nested fields (skills, months, features, tags) are edited here.
        </p>
      </div>
    </div>
  )
}

export default function ContentManager() {
  const { getToken } = useAuth()
  const [section, setSection] = useState('team')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)   // item id, '__new__', or '__doc__'
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)

  const spec = SECTIONS[section]
  const isCollection = spec.kind === 'collection'
  const idField = spec.idField

  const load = async (key = section) => {
    setLoading(true)
    setError('')
    try {
      const res = await apiClient.content.section(key)
      setData(res.data)
    } catch (err) {
      /* 404 means the section has never been stored — show what the site
         would fall back to, so the editor is never empty. */
      setData(FALLBACK[key])
      if (!/404|No content/i.test(err.message)) setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setEditing(null)
    setDraft(null)
    setNotice('')
    load(section)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])

  const items = useMemo(() => (Array.isArray(data) ? data : []), [data])

  const startEdit = item => {
    setEditing(item[idField])
    setDraft({ ...item })
    setNotice('')
  }

  const startNew = () => {
    /* Seed a new record from the shape of an existing one, so the editor
       shows which fields the section expects rather than an empty object. */
    const template = items[0]
      ? Object.fromEntries(Object.keys(items[0]).map(k => [k, isScalar(items[0][k]) ? '' : Array.isArray(items[0][k]) ? [] : {}]))
      : { [idField]: '' }
    setEditing('__new__')
    setDraft({ ...template, [idField]: '' })
    setNotice('')
  }

  const startDoc = () => {
    setEditing('__doc__')
    setDraft(data && typeof data === 'object' ? { ...data } : {})
    setNotice('')
  }

  const cancel = () => { setEditing(null); setDraft(null) }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const token = getToken()
      if (editing === '__doc__') {
        await apiClient.content.replace(section, draft, token)
      } else if (editing === '__new__') {
        await apiClient.content.addItem(section, draft, token)
      } else {
        await apiClient.content.updateItem(section, editing, draft, token)
      }
      await load()
      setEditing(null)
      setDraft(null)
      setNotice('Saved. The site serves this on the next page load.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async item => {
    if (!window.confirm(`Delete "${titleOf(item)}" from ${spec.label}? This cannot be undone.`)) return
    setError('')
    try {
      await apiClient.content.deleteItem(section, item[idField], getToken())
      await load()
      setNotice(`Deleted "${titleOf(item)}".`)
    } catch (err) {
      setError(err.message)
    }
  }

  const reset = async () => {
    if (!window.confirm(
      `Restore ${spec.label} to the version that shipped with the build? Every edit to this section is discarded.`
    )) return
    setError('')
    try {
      await apiClient.content.reset(section, getToken())
      await load()
      setEditing(null)
      setDraft(null)
      setNotice(`${spec.label} restored to defaults.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      {/* Section picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTION_KEYS.map(key => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className="px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              background: section === key ? 'var(--bg-card)' : 'transparent',
              border: `1px solid ${section === key ? 'var(--primary)' : 'var(--border)'}`,
              color: section === key ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            {SECTIONS[key].label}
            {SECTIONS[key].kind === 'collection' && section === key && ` (${items.length})`}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg flex gap-2"
          style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)' }}>
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      {notice && (
        <div className="mb-4 p-3 rounded-lg flex gap-2"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <Check className="w-4 h-4 shrink-0" style={{ color: '#22C55E' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{notice}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[minmax(0,22rem)_1fr] gap-6 items-start">

          {/* Left: the records in this section */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {spec.label}
              </span>
              <div className="flex gap-2">
                <button onClick={reset} title="Restore defaults"
                  className="p-1.5 rounded hover:opacity-70"
                  style={{ border: '1px solid var(--border)' }}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {isCollection && (
                  <button onClick={startNew} title="Add"
                    className="p-1.5 rounded hover:opacity-70"
                    style={{ border: '1px solid var(--border)' }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {isCollection ? (
              <div>
                {items.map(item => (
                  <div key={item[idField]}
                    className="flex items-center gap-2 px-4 py-3"
                    style={{
                      borderBottom: '1px solid var(--border)',
                      background: editing === item[idField] ? 'var(--bg-card)' : 'transparent',
                    }}>
                    <button onClick={() => startEdit(item)} className="flex-1 text-left">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{titleOf(item)}</p>
                      <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {item[idField]}
                      </p>
                    </button>
                    <button onClick={() => remove(item)} title="Delete"
                      className="p-1.5 rounded hover:opacity-70" style={{ border: '1px solid var(--border)' }}>
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="px-4 py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Nothing here yet. The site is showing its bundled copy of this section.
                  </p>
                )}
              </div>
            ) : (
              <div className="px-4 py-4">
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  One document: {Object.keys(data ?? {}).join(', ') || 'empty'}.
                </p>
                <button onClick={startDoc} className="btn btn-secondary text-sm">Edit document</button>
              </div>
            )}
          </div>

          {/* Right: the editor */}
          <div className="rounded-lg" style={{ border: '1px solid var(--border)', padding: '1.25rem' }}>
            {draft ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {editing === '__new__' ? `New ${spec.label} entry`
                      : editing === '__doc__' ? `${spec.label} document`
                      : titleOf(draft)}
                  </h3>
                  <button onClick={cancel} className="p-1.5 rounded hover:opacity-70"
                    style={{ border: '1px solid var(--border)' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <DraftEditor draft={draft} setDraft={setDraft} />

                <div className="flex items-center gap-3 mt-5">
                  <button onClick={save} disabled={saving} className="btn btn-primary text-sm">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={cancel} className="btn btn-secondary text-sm">Cancel</button>
                </div>
              </>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isCollection
                  ? 'Pick an entry on the left to edit it, or add a new one.'
                  : 'Open the document to edit it.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
