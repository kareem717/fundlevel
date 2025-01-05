'use client'

import { cn } from '@repo/ui/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import Balancer from 'react-wrap-balancer'
import { useActiveIndex } from '@/hooks/use-active-index'

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
  cta: {
    header,
    subheading,
    description,
  },
  index = 0,
  ...props
}: CTACardProps) {
  const { activeIndex, setActiveIndex } = useActiveIndex()

  return (
    <div
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-secondary transition-all duration-500 ease-in-out hover:cursor-pointer',
        activeIndex === index ? 'w-full' : 'w-2/3',
        className
      )}
      {...props}
    >
      {/* Content */}
      <div
        className={cn(
          'relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[500px] transition-all duration-500 ease-in-out',
          activeIndex === index ? 'w-[66.666667%]' : 'w-full'
        )}
      >
        <div className="flex flex-col gap-2">
          <ArrowUpRight
            className={cn(
              'p-1 bg-foreground text-background rounded-md transition-all duration-500',
              activeIndex === index ? 'w-10 h-10' : 'w-8 h-8'
            )}
          />
          <h3
            className={cn(
              'font-medium mt-8 transition-all duration-500 ease-in-out',
              activeIndex === index ? 'text-5xl mb-0' : 'text-4xl'
            )}
          >
            {header}
          </h3>
        </div>
        <div
          className={cn(
            'relative flex flex-col gap-4 py-4 my-4 transition-all duration-500 ease-in-out',
            activeIndex === index ? 'w-2/3' : 'w-full'
          )}
        >
          <p
            className={cn(
              'text-xl md:text-2xl transition-all duration-500 ease-in-out',
              activeIndex === index ? 'opacity-100' : 'opacity-40'
            )}
          >
            <Balancer>{subheading}</Balancer>
          </p>
          <p
            className={cn(
              'text-muted-foreground transition-all duration-500 ease-in-out',
              activeIndex === index
                ? 'opacity-100 max-h-[200px]'
                : 'opacity-0 max-h-0 overflow-hidden'
            )}
          >
            <Balancer>{description}</Balancer>
          </p>
        </div>
      </div>

      {/* Image */}
      <div
        className={cn(
          'absolute top-0 right-0 h-full overflow-hidden transition-all duration-500 ease-in-out',
          activeIndex === index ? 'w-[33.333333%]' : 'w-0'
        )}
      >
        <div className="w-full h-full overflow-hidden rounded-r-lg bg-foreground">
          {/* <Image
                    src={item.image}
                    alt={`${item.header} interface`}
                    width={800}
                    height={1200}
                    className="object-cover w-full h-full"
                  /> */}
        </div>
      </div>
    </div>
  )
}
