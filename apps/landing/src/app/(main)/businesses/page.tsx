import React from 'react'
import Hero from '../../../components/routes/businesses/hero'
import Problem from '../../../components/routes/businesses/problem'
import Value from '../../../components/routes/businesses/value'
import Models from '../../../components/routes/businesses/models'
import Standout from '../../../components/routes/businesses/standout'
import CTA from '../../../components/routes/businesses/cta'
import FAQ from '../../../components/routes/businesses/faq'

export default function Businesses() {
  return (
    <main className="relative flex flex-col items-center w-full">
      <Hero />
      <Problem />
      <Value />
      <Models />
      <Standout />
      <CTA />
      <FAQ />
    </main>
  )
}
