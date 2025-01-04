import { cn } from "@repo/ui/lib/utils"
import { ComponentPropsWithoutRef } from "react"

export interface LandingSectionProps extends ComponentPropsWithoutRef<'section'> {
  header?: {
    title: string
    subheading: string
  }
}

export function LandingSection({ children, className, header, ...props }: LandingSectionProps) {
  return (
    <section className={cn(header && 'space-y-12', className)} {...props}>
      {header && (
        <div className="space-y-4 text-center">
          <p className="text-sm tracking-wide text-muted-foreground uppercase">
            {header.subheading}
          </p>
          <h2 className="text-4xl tracking-tight md:text-5xl">
            {header.title}
          </h2>
        </div>
      )}
      {children}
    </section>
  )
}
