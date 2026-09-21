/**
 * Content hooks.
 *
 * Components used to import `TEAM`, `COURSES` and friends directly from
 * data/, which bound them to whatever shipped in the bundle. They call
 * these instead: same shapes, but read from the content API when it is
 * available and from the bundled copy when it is not.
 *
 * The derived values (departments, course fields, category chips) are
 * computed from whatever is loaded rather than hardcoded, so adding a
 * record in the admin adds its filter chip without a second edit, and
 * deleting the last record in a category removes an empty filter.
 */
import { useMemo } from 'react'
import { useContent } from '../context/ContentContext'
import { projectCats } from '../data/portfolio'
import { postCats } from '../data/posts'
import { serviceOptions } from '../data/services'

/* ── Team ─────────────────────────────────────────────────────────────── */

export const useTeam = () => useContent('team')

export function useMember(slug) {
  const team = useTeam()
  return useMemo(() => team.find(m => m.slug === slug), [team, slug])
}

/** Same department first, then anyone — "others you might work with". */
export function useRelatedMembers(slug, count = 3) {
  const team = useTeam()
  return useMemo(() => {
    const me = team.find(m => m.slug === slug)
    if (!me) return []
    const sameDept = team.filter(m => m.slug !== slug && m.dept === me.dept)
    const rest = team.filter(m => m.slug !== slug && m.dept !== me.dept)
    return [...sameDept, ...rest].slice(0, count)
  }, [team, slug, count])
}

/** Filter chips for the roster, in the order the team is listed. */
export function useDepts() {
  const team = useTeam()
  return useMemo(
    () => ['All', ...Array.from(new Set(team.map(m => m.dept).filter(Boolean)))],
    [team],
  )
}

/* ── Services ─────────────────────────────────────────────────────────── */

export const useServices = () => useContent('services')

/** The options the enquiry form offers, derived from the live catalogue. */
export function useServiceOptions() {
  const services = useServices()
  return useMemo(() => serviceOptions(services), [services])
}

/* ── Portfolio ────────────────────────────────────────────────────────── */

export const useProjects = () => useContent('portfolio')

export function useProjectCats() {
  const projects = useProjects()
  return useMemo(() => projectCats(projects), [projects])
}

/* ── Blog ─────────────────────────────────────────────────────────────── */

export const usePosts = () => useContent('posts')

export function usePostCats() {
  const posts = usePosts()
  return useMemo(() => postCats(posts), [posts])
}

/* ── Courses ──────────────────────────────────────────────────────────── */

export const useCourses = () => useContent('courses')

export function useCourse(slug) {
  const courses = useCourses()
  return useMemo(() => courses.find(c => c.slug === slug), [courses, slug])
}

export function useCourseFields() {
  const courses = useCourses()
  return useMemo(
    () => ['All', ...Array.from(new Set(courses.map(c => c.field).filter(Boolean)))],
    [courses],
  )
}

/* ── Single documents ─────────────────────────────────────────────────── */

export const useAbout = () => useContent('about')
export const useContactContent = () => useContent('contact')
