import { cn } from '@repo/ui/lib/utils'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Marquee } from './marquee'
import { NotificationList } from './notification-list'
import { PortfolioLineGraph } from './portfolio-line-graph'
import { AnimatedBeamDemo } from './integrations'

export type BentoItem = {
  title: string;
  description: string;
  element: ReactNode;
}
export const files = [
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

export const bentoItems: BentoItem[] = [
  {
    title: 'Numbers™',
    description: 'A comprehensive suite of tools for businesses to analyze activities and assess overall business health.',
    element: <PortfolioLineGraph />
  },
  {
    title: 'Clarity™',
    description: 'Our proprietary stack for investment and risk analysis, providing unparalleled insights and transparency.',
    element: <NotificationList className="h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
  },
  {
    title: 'Legal',
    description: 'Comprehensive handling of all legal aspects, ensuring compliance and peace of mind.',
    element: <Marquee className="[mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
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
  },
  {
    title: 'Integrations',
    description: 'Comprehensive handling of all legal aspects, ensuring compliance and peace of mind.',
    element: <AnimatedBeamDemo className="" />
  }
]

// TODO: get rid of
export function FeatureSection({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)} {...props} >
      {bentoItems.map((item, index) => (
        <div
          key={index}
          className={cn(
            "p-4 rounded-lg overflow-hidden min-h-[300px] relative bg-secondary",
            // isMobile && 'col-span-1 row-span-1/2',
            'md:col-span-2 md:row-span-2' // Added md breakpoint styles
          )}
        >
          <div className="relative flex flex-col justify-around h-full p-2 overflow-hidden group">
            {item.element}
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-medium tracking-tight">
                {item.title}
              </h3>
              <p className="text-base font-medium leading-relaxed text-muted-foreground/90">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
