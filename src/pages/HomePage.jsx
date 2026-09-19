import React from 'react'
import Hero             from '../components/sections/Hero'
import HeroSequence     from '../components/sections/HeroSequence'
import About            from '../components/sections/About'
import Services         from '../components/sections/Services'
import StatsCounter     from '../components/sections/StatsCounter'
import Team             from '../components/sections/Team'
import Testimonials     from '../components/sections/Testimonials'
import FAQ              from '../components/sections/FAQ'
import CTA              from '../components/sections/CTA'

/**
 * Home page order follows the questions a prospect actually asks, in order:
 * who are you (01–02) → what do you do (03) → does it work (04) →
 * who would I work with (05) → do others trust you (06) → what about… (07)
 * → and then the ask.
 *
 * Team, FAQ and the closing CTA were built but never mounted here; the page
 * previously ended on testimonials without ever asking for the business.
 */
export default function HomePage() {
  return (
    <>
      <HeroSequence>
        <Hero layered />    {/* 01 */}
      </HeroSequence>
      <About />             {/* 02 */}
      <Services />          {/* 03 */}
      <StatsCounter />      {/* 04 */}
      <Team />              {/* 05 */}
      <Testimonials />      {/* 06 */}
      <FAQ />               {/* 07 */}
      <CTA />
    </>
  )
}
