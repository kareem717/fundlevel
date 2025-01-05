'use client'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@repo/ui/lib/utils'
import { FC, ComponentPropsWithoutRef } from 'react'
import { Marquee } from '@/components/marquee'
import { AnimatedListDemo } from './bento/notification'
import Balancer from 'react-wrap-balancer'
import { PortfolioLineGraph } from './bento/portfolio-line-graph'

const colSpans = {
  1: 'lg:col-span-1',
  2: 'lg:col-span-2',
  4: 'lg:col-span-4',
}

const files = [
  {
    name: 'bitcoin.pdf',
    body: 'Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.',
  },
  {
    name: 'finances.xlsx',
    body: 'A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.',
  },
  {
    name: 'logo.svg',
    body: 'Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.',
  },
  {
    name: 'keys.gpg',
    body: 'GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.',
  },
  {
    name: 'seed.txt',
    body: 'A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.',
  },
]

const bentoItems = [
  {
    id: 3,
    title: 'Numbers™',
    color: 'bg-secondary',
    element: (
      <div className="relative flex flex-col justify-around h-full p-2 overflow-hidden group">
        <PortfolioLineGraph />

        <div className="relative z-10">
          <h3 className="mb-2 text-xl font-medium tracking-tight">
            Numbers™
          </h3>
          <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
            A comprehensive suite of tools for businesses to analyze
            activities and assess overall business health.
          </p>
        </div>
      </div>
    ),
    width: 2,
    height: 2,
  },
  {
    id: 4,
    title: 'Clarity™',
    color: 'bg-secondary',
    element: (
      <div className="flex flex-col justify-end h-full p-2 overflow-hidden group">
        <AnimatedListDemo className="absolute right-0 top-0 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />

        <div className="relative z-10">
          <h3 className="mb-2 text-2xl font-medium tracking-tight">
            Clarity™
          </h3>
          <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
            Our proprietary stack for investment and risk analysis, providing
            unparalleled insights and transparency.
          </p>
        </div>
      </div>
    ),
    width: 2,
    height: 2,
  },
  {
    id: 5,
    title: 'Legal',
    color: 'bg-secondary',
    element: (
      <div className="flex flex-col justify-around h-full p-2 overflow-hidden group">
        <div className="relative h-full">
          <Marquee className="absolute top-0 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
            {files.map((f, idx) => (
              <figure
                key={idx}
                className={cn(
                  'relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4',
                  'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
                  'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
                  'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none'
                )}
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white ">
                      {f.name}
                    </figcaption>
                  </div>
                </div>
                <blockquote className="mt-2 text-xs">{f.body}</blockquote>
              </figure>
            ))}
          </Marquee>
        </div>

        <div className="relative">
          <h3 className="flex items-center gap-2 text-xl font-medium tracking-tight">
            Legal
            <span className="inline-block animate-pulse">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="rgb(251 146 60 / 0.8)"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </span>
          </h3>
          <p className="mt-2 text-muted-foreground">
            <Balancer>
              Comprehensive handling of all legal aspects, ensuring compliance
              and peace of mind.
            </Balancer>
          </p>
        </div>
      </div>
    ),
    width: 1,
    height: 2,
  },
]

export const BentoFeatures: FC<ComponentPropsWithoutRef<'section'>> = ({
  className,
  ...props
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section className={cn('space-y-12', className)} {...props}>
      <div className="space-y-4 text-center">
        <p className="text-sm tracking-wide text-muted-foreground">
          PLATFORM FEATURES
        </p>
        <h2 className="text-4xl tracking-tight md:text-5xl">
          Powerful Tools & Features
        </h2>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {bentoItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              `${item?.color ?? 'bg-white'} p-4 rounded-lg overflow-hidden min-h-[300px] relative`,
              colSpans[item.width as keyof typeof colSpans],
              isMobile && 'col-span-1 row-span-1/2',
              'md:col-span-2 md:row-span-2' // Added md breakpoint styles
            )}
          >
            {item.element}
          </div>
        ))}
      </div>
    </section>
  )
}
