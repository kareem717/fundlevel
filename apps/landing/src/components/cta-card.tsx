'use client'

import { cn } from '@repo/ui/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import Balancer from 'react-wrap-balancer'
import { useActiveIndex } from '@/hooks/use-active-index'
import { useIsMobile } from '@repo/ui/hooks/use-mobile'

export type CTA = {
  header: string
  subheading: string
  description: string
}

export interface CTACardProps extends ComponentPropsWithoutRef<'div'> {
  cta: CTA
  index?: number
}

export function CTACard({
  className,
  cta: { header, subheading, description },
  index = 0,
  ...props
}: CTACardProps) {
  const { activeIndex, setActiveIndex } = useActiveIndex()
  const isMobile = useIsMobile()
  const isActive = activeIndex === index && !isMobile

  //TODO: i don't like these objects
  const cardStyles = {
    base: 'relative overflow-hidden rounded-2xl bg-secondary transition-all duration-500 ease-in-out hover:cursor-pointer',
    width: isActive ? 'w-full' : !isMobile ? 'w-2/3' : 'w-full',
  }

  const contentStyles = {
    wrapper: cn(
      'relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[500px] transition-all duration-500 ease-in-out',
      isActive ? 'w-2/3' : isMobile ? 'w-full' : 'w-2/3'
    ),
    icon: cn(
      'p-1 bg-foreground text-background rounded-md transition-all duration-500',
      isActive ? 'w-10 h-10' : !isMobile ? 'w-8 h-8' : 'w-6 h-6'
    ),
    header: cn(
      'font-medium mt-8 transition-all duration-500 ease-in-out',
      isActive ? 'text-5xl mb-0' : !isMobile ? 'text-4xl' : 'text-3xl'
    ),
    textContainer: cn(
      'relative flex flex-col gap-4 py-4 my-4 transition-all duration-500 ease-in-out',
      isActive ? 'w-2/3' : 'w-full'
    ),
    subheading: cn(
      'text-xl md:text-2xl transition-all duration-500 ease-in-out',
      isActive ? 'opacity-100' : 'opacity-40'
    ),
    description: cn(
      'text-muted-foreground transition-all duration-500 ease-in-out',
      isActive ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0 overflow-hidden'
    ),
  }

  return (
    <div
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      className={cn(cardStyles.base, cardStyles.width, className)}
      {...props}
    >
      <div className={contentStyles.wrapper}>
        <div className="flex flex-col gap-2">
          <ArrowUpRight className={contentStyles.icon} />
          <h3 className={contentStyles.header}>{header}</h3>
        </div>
        <div className={contentStyles.textContainer}>
          <p className={contentStyles.subheading}>
            <Balancer>{subheading}</Balancer>
          </p>
          <p className={contentStyles.description}>
            <Balancer>{description}</Balancer>
          </p>
        </div>
      </div>
      <div
        className={cn(
          'absolute top-0 right-0 h-full overflow-hidden transition-all duration-500 ease-in-out',
          isActive ? 'w-1/3' : 'w-0'
        )}
      >
        <div className="w-full h-full overflow-hidden rounded-r-lg bg-foreground" />
      </div>
    </div>
  )
}
