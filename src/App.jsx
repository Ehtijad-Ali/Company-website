import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ContactProvider } from './context/ContactContext'
import { AuthProvider } from './context/AuthContext'
import CustomCursor    from './components/CustomCursor'
import ScrollProgress  from './components/ScrollProgress'
import Loader          from './components/Loader'
import Navbar          from './components/Navbar'
import Footer          from './components/sections/Footer'
import ContactModal    from './components/ContactModal'
import ChatWidget      from './components/ChatWidget'
import ProtectedRoute  from './components/ProtectedRoute'
import RouteSeo        from './components/RouteSeo'

/**
 * Pages load on demand.
 *
 * Every route used to be in the first bundle, so someone landing on the
 * home page downloaded the admin panel, the legal pages and three course
 * detail views before the hero could paint. The home page is the one
 * exception — it is the most common entry point, and lazy-loading it only
 * adds a round trip before anything appears.
 */
import HomePage from './pages/HomePage'

const AboutPage         = lazy(() => import('./pages/AboutPage'))
const ServicesPage      = lazy(() => import('./pages/ServicesPage'))
const PortfolioPage     = lazy(() => import('./pages/PortfolioPage'))
const TeamPage          = lazy(() => import('./pages/TeamPage'))
const MemberProfilePage = lazy(() => import('./pages/MemberProfilePage'))
const CourseDetailPage  = lazy(() => import('./pages/CourseDetailPage'))
const ContactPage       = lazy(() => import('./pages/ContactPage'))
const BlogPage          = lazy(() => import('./pages/BlogPage'))
const PrivacyPage       = lazy(() => import('./pages/PrivacyPage'))
const TermsPage         = lazy(() => import('./pages/TermsPage'))
const CookiesPage       = lazy(() => import('./pages/CookiesPage'))
const SitemapPage       = lazy(() => import('./pages/SitemapPage'))
const LoginPage         = lazy(() => import('./pages/LoginPage'))
const RegisterPage      = lazy(() => import('./pages/RegisterPage'))
const AdminPage         = lazy(() => import('./pages/AdminPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

/** Holds the viewport height while a route's chunk arrives, so the footer
 *  does not jump up the screen and back down again. */
function RouteFallback() {
  return <div style={{ minHeight: '70vh' }} aria-busy="true" />
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    /* A hash is a request for a specific place on the page — honour it
       instead of overriding it with the top. The target may belong to a
       route chunk that has not painted yet, hence the frame's grace. */
    if (hash) {
      const id = hash.slice(1)
      const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const t = setTimeout(jump, 120)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function AnimatedRoutes({ children }) {
  const { pathname } = useLocation()
  const key = useRef(pathname)
  if (key.current !== pathname) key.current = pathname
  return (
    <div key={key.current} className="page-enter">
      {children}
    </div>
  )
}

/* The intro plays once per browser session. A title sequence is a welcome
   the first time and a toll gate every time after it — and someone who
   arrives on a deep link, reads a page and comes back should not have to
   watch it again. sessionStorage, not localStorage: a new visit tomorrow
   is a new arrival. */
const INTRO_KEY = 'codenode:intro-played'
const introAlreadyPlayed = () => {
  try { return sessionStorage.getItem(INTRO_KEY) === '1' } catch { return false }
}

function AppContent() {
  const [seenIntro] = useState(introAlreadyPlayed)
  const [loaded, setLoaded] = useState(seenIntro)

  useEffect(() => {
    if (seenIntro) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setLoaded(true)
      document.body.style.overflow = ''
      try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* private mode */ }
    }, 2600)
    return () => { clearTimeout(t); document.body.style.overflow = '' }
  }, [seenIntro])

  return (
    <>
      <ScrollToTop />
      <RouteSeo />
      <CustomCursor />
      <ScrollProgress />
      {/* Not mounted at all on a return visit — mounting it just to run
          its exit sequence would still flash the panels. */}
      {!seenIntro && <Loader done={loaded} />}
      <Navbar />
      <ContactModal />
      <ChatWidget />
      <main>
        <AnimatedRoutes>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/"          element={<HomePage />} />
              <Route path="/about"     element={<AboutPage />} />
              <Route path="/services"  element={<ServicesPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/team"       element={<TeamPage />} />
              <Route path="/team/:slug" element={<MemberProfilePage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/blog"      element={<BlogPage />} />
              <Route path="/privacy"   element={<PrivacyPage />} />
              <Route path="/terms"     element={<TermsPage />} />
              <Route path="/cookies"   element={<CookiesPage />} />
              <Route path="/sitemap"   element={<SitemapPage />} />
              <Route path="/login"     element={<LoginPage />} />
              <Route path="/register"  element={<RegisterPage />} />
              <Route path="/admin"     element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
              <Route path="/contact"   element={<ContactPage />} />
              <Route path="/404"        element={<NotFoundPage />} />
              <Route path="*"          element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AnimatedRoutes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ContactProvider>
            <AppContent />
          </ContactProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
