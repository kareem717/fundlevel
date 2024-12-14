import { FC } from 'react'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Container, Section } from '@/components/layout'
import Balancer from 'react-wrap-balancer'

interface HeroSectionProps {
  className?: string
}

const HeroSection: FC<HeroSectionProps> = ({ className }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-8">
          <div className="flex flex-col space-y-6 text-left">
            <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <Balancer>
                Invest hassle free in businesses that{' '}
                <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                  actually make returns.
                </span>
              </Balancer>
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
              <Balancer>
                Create stable income with unique models that are in
                everyone&apos;s interest. Start your investment journey today.
              </Balancer>
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'group relative overflow-hidden'
                )}
              >
                Get Started
                <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-rose-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </div>
          </div>

          <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/30 dark:to-rose-950/30">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <span>Image Placeholder</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { HeroSection }
