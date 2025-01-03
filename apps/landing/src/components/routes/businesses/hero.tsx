'use client'

import { Button } from '@repo/ui/components/button'
import { motion } from 'framer-motion'
import { FC } from 'react'
import { Container, Section } from '@/components/layout'
import { cn } from '@/lib/utils'
import Balancer from 'react-wrap-balancer'

interface HeroProps {
  className?: string
}

const Hero: FC<HeroProps> = ({ className = '' }) => {
  return (
    <Section className={cn('', className)}>
      <Container className={cn('p-24', className)}>
        <div className="flex flex-col lg:flex-row items-center justify-center pt-8">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-medium text-foreground">
              <Balancer>
                Grow Your Business With{' '}
                <span className="text-cyan-500 dark:text-cyan-400">
                  Smart Capital
                </span>
              </Balancer>
            </h1>
            <p className="mt-4 lg:mx-0 text-lg md:text-xl text-muted-foreground">
              <Balancer>
                Access flexible funding solutions that align with your growth,
                preserve your ownership, and eliminate traditional debt burdens.
              </Balancer>
            </p>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-400 dark:hover:bg-cyan-500 text-white px-8"
              >
                Get Started
              </Button>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square max-w-md">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-2xl" />
            <div className="absolute inset-0 bg-neutral-900/10 dark:bg-neutral-100/10 backdrop-blur-2xl rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-cyan-500/20 dark:bg-cyan-400/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-500 dark:text-cyan-400 text-3xl">
                  B
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default Hero
