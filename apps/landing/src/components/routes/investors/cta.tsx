'use client'

import { FC, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Container } from '@/components/layout'
import { Section } from '@/components/layout'
import Balancer from 'react-wrap-balancer'

interface CTAProps {
  className?: string
}

const CTA: FC<CTAProps> = ({ className }) => {
  return (
    <Section className={cn('relative', className)}>
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
              <Balancer>
                Transform Your Investment Portfolio{' '}
                <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                  Today
                </span>
              </Balancer>
            </h2>

            <Balancer>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Join sophisticated investors accessing exclusive private market
                opportunities with returns that outperform traditional
                investments.
              </p>
            </Balancer>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:opacity-90'
                )}
              >
                Start Investing Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-orange-400">
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
                <span>Vetted Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">
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
                <span>Shariah Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-400">
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
                <span>Expert Support</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/30 dark:to-rose-950/30">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <span>Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { CTA }
