'use client'

import { FC } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Balancer } from 'react-wrap-balancer'
import { Section } from '@/components/layout'
import { Container } from '@/components/layout'

interface StandoutProps {
  className?: string
}

const standoutConfig = {
  interest: {
    title: 'Interest and Debt-Free Models',
    description: 'Access capital without the burden of interest or debt.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  technology: {
    title: 'Cutting-Edge Proprietary Technology',
    description: 'Leverage advanced tools for seamless funding management and insights.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  shariah: {
    title: 'Shariah Compliance',
    description: 'Raise funds with confidence, knowing all opportunities align with ethical and religious standards.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  support: {
    title: 'Support for All Business Sizes',
    description: 'Cater to diverse business profiles, from startups to established enterprises.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      </svg>
    ),
  },
  ease: {
    title: 'Ease of Use and Transparency',
    description: 'Enjoy a user-friendly platform with clear, transparent processes and information.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
}

const StandoutSection: FC<StandoutProps> = ({ className }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              What Makes Us{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Different
              </span>
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              Our platform is built differently from the ground up to serve
              businesses better
            </Balancer>
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Background blobs */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-cyan-400/15 to-blue-400/15 rounded-full blur-2xl -z-10" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-cyan-400/20 to-blue-400/20 rounded-full blur-xl -z-10" />

          <div className="flex flex-wrap justify-center gap-6">
            {Object.entries(standoutConfig).map(([key, item]) => (
              <div
                key={key}
                className="flex flex-col items-center justify-center space-y-4 w-[360px] h-64 p-2 rounded-xl group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center">
                  {item.icon}
                </div>
                <Balancer>
                  <h3 className="text-lg font-medium text-center">
                    {item.title}
                  </h3>
                </Balancer>
                <Balancer>
                  <p className="text-base text-muted-foreground text-center">
                    {item.description}
                  </p>
                </Balancer>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { StandoutSection }
