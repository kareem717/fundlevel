'use client'

import { Box, Container } from '@/app/components/layout'
import { Section } from '@/app/components/layout'
import { cn } from '@repo/ui/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { ComponentPropsWithoutRef, FC, useState } from 'react'
import Balancer from 'react-wrap-balancer'

const models = [
  {
    title: 'Equity Financing',
    description:
      'Empowering investors to own a share of businesses, benefiting from dividends or capital growth.',
    color:
      'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  {
    title: 'Revenue/Profit Sharing',
    description:
      'Offering a share of business profits over time, ideal for cash-flow positive ventures.',
    color:
      'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-800',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    title: 'Asset Funding Arrangements',
    description:
      'Facilitating shared ownership of assets, generating profits from their use.',
    color:
      'bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800',
    borderColor: 'border-purple-200 dark:border-purple-800',
  },
  {
    title: 'Mergers & Acquisitions',
    description:
      'Streamlining business growth and consolidation through strategic partnerships and acquisitions.',
    color:
      'bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
]

export const Models: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <Section className={cn(className)} {...props}>
      <Container>
        <Box
          direction="col"
          className="items-center justify-center gap-4 text-center"
        >
          <p className="text-sm text-muted-foreground">INVESTMENT MODELS</p>
          <h2 className="text-4xl tracking-tight md:text-5xl">Our Services</h2>
        </Box>
        <Box cols={{ sm: 1, md: 2, lg: 4 }} gap={4}>
          {models.map((model, index) => (
            <div
              key={index}
              className={cn(
                'group relative rounded-lg',
                'p-6 flex flex-col h-[280px] lg:h-[350px] text-foreground gap-8',
                'bg-secondary'
              )}
            >
              <div className="text-sm font-medium text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="flex flex-col flex-1 gap-4">
                <h3 className="text-xl font-medium">
                  <Balancer>{model.title}</Balancer>
                </h3>
                <p className="text-muted-foreground mb-auto">
                  <Balancer>{model.description}</Balancer>
                </p>
              </div>

              {/* <Link
                href="/investors"
                className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-md bg-secondary-foreground/10 hover:bg-secondary-foreground/20 transition-colors w-fit"
              >
                Learn more
                <span className="ml-2">→</span>
              </Link> */}
            </div>
          ))}
        </Box>
      </Container>
    </Section>
  )
}
