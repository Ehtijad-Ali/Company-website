import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-xl w-full text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '4rem 2rem' }}>
        <p className="text-sm uppercase tracking-[0.32em] mb-4" style={{ color: 'var(--text-secondary)' }}>404 · Page not found</p>
        <h1 className="text-6xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Oops!</h1>
        <p className="text-base leading-7 mb-8" style={{ color: 'var(--text-secondary)' }}>
          We couldn't find the page you were looking for. It may have moved or never existed.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-8 py-3 rounded-2xl font-semibold text-sm"
          style={{ background: 'var(--primary)', color: 'var(--primary-contrast)' }}>
          Back to home
        </Link>
      </div>
    </div>
  )
}
