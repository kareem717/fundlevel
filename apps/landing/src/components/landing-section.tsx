import { cn } from "@repo/ui/lib/utils"
import { ComponentPropsWithoutRef } from "react"

export interface LandingSectionProps extends ComponentPropsWithoutRef<'section'> {
  title?: string
  subheading?: string
}

export function LandingSection({ children, className, title, subheading, ...props }: LandingSectionProps) {
  const hasHeader = title || subheading

  return (
    <section className={cn(hasHeader && 'space-y-12', 'w-full')} {...props}>
      {hasHeader && (
        <div className="space-y-4 text-center">
          {title && (
            <p className="text-sm tracking-wide text-muted-foreground uppercase">
              {title}
            </p>
          )}
          {subheading && (
            <h2 className="text-4xl tracking-tight md:text-5xl">
              {subheading}
            </h2>
          )}
        </div>
      )}
      <div className={className}>
        {children}
      </div>
    </section>
  )
}
