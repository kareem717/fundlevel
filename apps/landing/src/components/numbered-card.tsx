import { cn } from '@repo/ui/lib/utils'
import React, { ComponentPropsWithoutRef, FC } from 'react'
import Balancer from 'react-wrap-balancer'

export type NumberedCard = {
  title: string
  description: string
}

export interface NumberedCardProps extends ComponentPropsWithoutRef<'div'> {
  card: NumberedCard
  index?: number
}

export function NumberedCard({
  className,
  card: {
    title,
    description,
  },
  index = 1,
  ...props
}: NumberedCardProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg',
        'p-6 flex flex-col h-[280px] lg:h-[350px] text-foreground gap-8',
        'bg-secondary',
        className,
      )}
      {...props}
    >
      <div className="text-sm font-medium text-muted-foreground">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <h3 className="text-xl font-medium">
          <Balancer>{title}</Balancer>
        </h3>
        <p className="text-muted-foreground mb-auto">
          <Balancer>{description}</Balancer>
        </p>
      </div>
    </div>
  )
}
