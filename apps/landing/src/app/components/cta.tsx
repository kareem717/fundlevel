'use client'

import { cn } from '@repo/ui/lib/utils'
import { ArrowUpRight } from 'lucide-react'
import React, { ComponentPropsWithoutRef, FC, useState } from 'react'
import Balancer from 'react-wrap-balancer'

const items = [
  {
    header: 'Invest',
    subheading: 'Discover high growth investments.',
    description:
      'Access a range of shariah-compliant models, from revenue sharing to asset leasing, and grow your portfolio.',
    buttonText: 'Learn More',
    image:
      'https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-card-desktop.png&w=828&q=75',
    url: '/invest',
  },
  {
    header: 'Raise',
    subheading: 'Secure capital without debt or interest.',
    description:
      'Connect with investors through equity crowdfunding, profit-sharing, and more. Grow your business ethically and efficiently.',
    buttonText: 'Get Started',
    image:
      'https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-capital-desktop.png&w=828&q=75',
    url: '/raise',
  },
]

export const CTA: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className={cn('space-y-12', className)} {...props}>
      <div className="space-y-4 text-center">
        <p className="text-sm tracking-wide text-muted-foreground">
          JOIN FUNDLEVEL
        </p>
        <h2 className="text-4xl tracking-tight md:text-5xl">
          Invest & Raise Capital With Confidence
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            className={cn(
              'relative overflow-hidden rounded-2xl bg-secondary transition-all duration-500 ease-in-out',
              activeIndex === index ? 'w-full' : 'w-[66.666667%]'
            )}
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
                  {item.header}
                </h3>
              </div>
              <div
                className={cn(
                  'relative flex flex-col gap-8 py-4 my-4 transition-all duration-500 ease-in-out',
                  activeIndex === index ? 'w-2/3' : 'w-full'
                )}
              >
                <p
                  className={cn(
                    'text-xl md:text-2xl transition-all duration-500 ease-in-out',
                    activeIndex === index ? 'translate-y-1' : 'translate-y-24'
                  )}
                >
                  <Balancer>{item.subheading}</Balancer>
                </p>
                <p
                  className={cn(
                    'absolute text-muted-foreground top-full transition-all duration-500 ease-in-out',
                    activeIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-16'
                  )}
                >
                  <Balancer>{item.description}</Balancer>
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
        ))}
      </div>
    </section>
  )
}
