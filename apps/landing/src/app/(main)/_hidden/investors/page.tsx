import React from 'react'
import { HeroSection } from '../../../../components/routes/investors/hero'
import { ProblemStatement } from '../../../../components/routes/investors/problem'
import { ValueProp } from '../../../../components/routes/investors/value'
import { ModelsSection } from '../../../../components/routes/investors/models'
import { StandoutSection } from '../../../../components/routes/investors/standout'
import { CTA } from '../../../../components/routes/investors/cta'
import { FAQSection } from '../../../../components/routes/investors/faq'

export default function InvestorsPage() {
  return (
    <main className="relative flex flex-col items-center w-full">
      <HeroSection />
      <ProblemStatement />
      <ValueProp />
      <ModelsSection />
      <StandoutSection />
      <CTA />
      <FAQSection />
    </main>
  )
}
