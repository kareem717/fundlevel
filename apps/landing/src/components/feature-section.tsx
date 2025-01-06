import { cn } from '@repo/ui/lib/utils'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { NotificationList } from './notification-list'
import { PortfolioLineGraph } from './portfolio-line-graph'
import { PaymentHandlingFlow } from './payment-handling-flow'
import { LegalFiles } from './legal-files'

export type BentoItem = {
  title: string;
  description: string;
  element: ReactNode;
}


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
    element: <LegalFiles />
  },
  {
    title: 'Integrations',
    description: 'Comprehensive handling of all legal aspects, ensuring compliance and peace of mind.',
    element: <PaymentHandlingFlow />
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
