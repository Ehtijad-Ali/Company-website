import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon, Menu, X, LogOut, Shield } from 'lucide-react'
import CodeNodeLogo from './CodeNodeLogo'

const LINKS = [
  { to: '/',            label: 'Home'         },
  { to: '/about',       label: 'About'        },
  { to: '/services',    label: 'Services'     },
  { to: '/portfolio',   label: 'Portfolio'    },
  /* The courses live inside the services page rather than on a route of
     their own — a second listing would be the same nine cards competing
     with the first for the same search. The anchor is how they are found. */
  { to: '/services#courses', label: 'Courses' },
  { to: '/team',        label: 'Team'         },
  { to: '/blog',        label: 'Blog'         },
  { to: '/contact',     label: 'Contact'      },
]

export default function Navbar() {
  const { isDark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 py-4"
    >
      <div
        className={`max-w-[1440px] mx-auto flex items-center justify-between px-5 py-3 transition-all duration-400${scrolled ? ' navbar-blur' : ''}`}
        style={{
          borderRadius: 'var(--r-lg)',
          background: scrolled ? 'rgba(var(--bg-card-rgb), 0.82)' : 'transparent',
          border: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--e-2)' : 'none',
          transition: 'background 0.35s var(--ease), border-color 0.35s var(--ease), box-shadow 0.35s var(--ease)',
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <CodeNodeLogo height={32} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className="relative px-3.5 py-2 text-sm transition-colors"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {/* An underline reads as editorial where a pill reads as template */}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3.5 right-3.5 -bottom-0.5"
                    style={{ height: 1.5, background: 'var(--brand)', borderRadius: 2 }}
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                  />
                )}
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center hover-scale micro-click"
            style={{ borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--border)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
          >
            <AnimatePresence mode="wait">
              {isDark
                ? <motion.span key="sun"  initial={{ rotate: -90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:90, opacity:0 }} transition={{ duration:.2 }}><Sun  className="w-4 h-4" style={{ color: '#FBBF24' }} /></motion.span>
                : <motion.span key="moon" initial={{ rotate:  90, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:-90, opacity:0 }} transition={{ duration:.2 }}><Moon className="w-4 h-4" style={{ color: 'var(--accent)' }} /></motion.span>
              }
            </AnimatePresence>
          </button>

          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium btn btn-secondary hover-scale micro-click">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <button
                onClick={() => { logout(); setOpen(false) }}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-70"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                title={`Logout ${user.username}`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:flex btn btn-secondary btn-hover-micro micro-click text-sm">
                Login
              </Link>
              <Link to="/register" className="hidden md:flex btn btn-primary btn-hover-micro micro-click text-sm">
                Register
              </Link>
            </>
          )}

          {/* Goes to the contact page rather than opening the overlay: the
              overlay renders that same page full-screen, so the modal was
              the contact page wearing a close button. */}
          <Link to="/contact" className="hidden md:flex btn btn-primary btn-hover-micro micro-click text-sm">
            Let's Talk
          </Link>

          <button onClick={() => setOpen(v => !v)} className="md:hidden w-9 h-9 flex items-center justify-center"
            style={{ borderRadius: 'var(--r-md)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-[1500px] mx-auto mt-2 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            {LINKS.map(({ to, label }, i) => (
              <motion.div key={to} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.05 }}>
                <Link
                  to={to}
                  className="flex items-center px-6 py-4 text-sm font-medium transition-colors"
                  style={{ color: pathname === to ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <div className="p-4 space-y-2">
              {user ? (
                <>
                  {user.is_admin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="btn btn-secondary w-full justify-center flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setOpen(false) }}
                    className="btn btn-secondary w-full justify-center flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn btn-secondary w-full justify-center">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary w-full justify-center">Register</Link>
                </>
              )}
              <Link to="/contact" onClick={() => setOpen(false)} className="btn btn-primary w-full justify-center">Let's Talk</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
