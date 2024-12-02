'use client'

import { cn } from '@/lib/utils'
import { Section } from '@/components/layout'
import { Container } from '@/components/layout'
import Balancer from 'react-wrap-balancer'
import { motion } from 'framer-motion'
import { FC } from 'react'

interface ValueProps {
  className?: string
}

type ValueConfig = {
  title: string
  heading: string
  subheading: string
  points: string[]
}

const bentos: ValueConfig[] = [
  {
    title: 'Models',
    heading: 'Raise strategically via models that make sense for you',
    subheading: 'Select ways to raise capital that do not damage your business',
    points: [
      'Choose from equity crowdfunding, revenue sharing, and profit-sharing models.',
      'Maintain control and ownership while accessing necessary funds.',
      "Align your funding strategy with your business's ethical and growth objectives.",
    ],
  },
  {
    title: 'Tooling',
    heading: 'Advanced tools for business growth',
    subheading:
      'Leverage technology to optimize your funding and growth strategies.',
    points: [
      'Utilize AI-driven insights to match with the right investors.',
      'Access financial modeling and forecasting tools to plan effectively.',
      'Benefit from investor matching based on industry and preference.',
    ],
  },
  {
    title: 'Support',
    heading: 'Comprehensive support for success',
    subheading: 'Get the resources you need to thrive.',
    points: [
      'Streamlined onboarding and compliance processes.',
      'Access to business development resources and mentorship.',
      'Ongoing analytics to track performance and optimize returns.',
    ],
  },
  {
    title: 'Permissible',
    heading: 'Shariah compliance at the core',
    subheading: 'Zero tolerance policy for non-compliance',
    points: [
      'All models validated by Islamic finance boards.',
      'Continuous business monitoring to ensure halal operations.',
      'Not just a feature, but a real personal commitment by the team.',
    ],
  },
  // Add other bentos here...
]

const Value: FC<ValueProps> = ({ className = '' }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              Raise capital with{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                confidence
              </span>
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              Secure funding that aligns with your business values and growth
              goals.
            </Balancer>
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {bentos.map((valuePoint, index) => (
            <ValueSection
              key={valuePoint.title}
              inverse={index % 2 === 0}
              valuePoint={valuePoint}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}

const ValueSection: FC<{
  inverse?: boolean
  valuePoint: {
    title: string
    heading: string
    subheading: string
    points: string[]
  }
}> = ({ inverse, valuePoint }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
      {/* Content Column */}
      <div className={cn('space-y-6', !inverse && 'lg:order-last')}>
        <div className="space-y-4">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            <Balancer>{valuePoint.heading}</Balancer>
          </h2>
          <p className="text-lg text-muted-foreground">
            <Balancer>{valuePoint.subheading}</Balancer>
          </p>
        </div>

        <ul className="space-y-4">
          {valuePoint.points.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 text-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <Balancer className="text-muted-foreground">{point}</Balancer>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Column */}
      <div className={cn('', !inverse && 'lg:order-first')}>
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950/30 dark:to-blue-950/30">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span>Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Value
