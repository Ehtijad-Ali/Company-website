import { useLocation, matchPath } from 'react-router-dom'
import Seo from './Seo'
import { ROUTE_META } from '../data/seo'

/* Exact matches win over patterns, so /team never picks up /team/:slug. */
const PATTERNS = Object.keys(ROUTE_META).sort(
  (a, b) => Number(a.includes(':')) - Number(b.includes(':'))
)

/**
 * Applies the route table to whatever page is showing.
 *
 * Sits once in the app shell rather than once per page — a page that
 * forgets to describe itself still gets a correct title and canonical,
 * and a page with something better to say (a named team member, a course)
 * renders its own <Seo> which lands after this one and wins.
 */
export default function RouteSeo() {
  const { pathname } = useLocation()
  const pattern = PATTERNS.find(p => matchPath({ path: p, end: true }, pathname))
  const meta = pattern ? ROUTE_META[pattern] : {}

  return <Seo {...meta} path={pathname} />
}
