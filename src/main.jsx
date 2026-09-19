import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (this.state.err) {
      return (
        <div style={{
          position: 'fixed', inset: 0, background: '#14100E',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', color: '#F4EADE',
          fontFamily: "'Inter', system-ui, sans-serif",
          padding: 32, gap: 14
        }}>
          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontWeight: 500, fontSize: 28, letterSpacing: '-0.02em', margin: 0,
          }}>
            Something went <em style={{ fontStyle: 'italic', color: '#D68667' }}>wrong</em>
          </h2>
          <p style={{ color: '#9C8878', fontSize: 14, margin: '0 0 8px', textAlign: 'center' }}>
            The page hit an unexpected error. Reloading usually clears it.
          </p>
          <pre style={{
            background: '#1B1512', border: '1px solid rgba(238,220,200,0.10)',
            borderRadius: 8, padding: '16px 20px', maxWidth: 700, width: '100%',
            overflow: 'auto', fontSize: 12, lineHeight: 1.6,
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            color: '#C4B2A2', whiteSpace: 'pre-wrap'
          }}>
            {this.state.err?.message}
            {'\n\n'}
            {this.state.err?.stack}
          </pre>
          <button onClick={() => window.location.reload()}
            style={{ background: '#C96A4A', color: '#FFFCF8', border: 'none',
              borderRadius: 8, padding: '11px 22px', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, fontFamily: 'inherit' }}>
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
