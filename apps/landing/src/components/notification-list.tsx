import { AnimatedList } from './animated-list'
import { cn } from '@repo/ui/lib/utils'
import { ComponentPropsWithoutRef, FC } from 'react'

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
  riskLevel: 'low' | 'medium' | 'high'
}

let notifications: Item[] = [
  {
    name: 'New Investment Opportunity',
    description: 'Green Energy ETF matches your profile',
    time: 'Just now',
    icon: '📈',
    color: '#00C9A7',
    riskLevel: 'low',
  },
  {
    name: 'Risk Level Change',
    description: 'Tech Portfolio risk increased to HIGH',
    time: '5m ago',
    icon: '⚠️',
    color: '#FF3D71',
    riskLevel: 'high',
  },
  {
    name: 'Position Update',
    description: 'Added $5000 to Real Estate Fund',
    time: '15m ago',
    icon: '🏢',
    color: '#1E86FF',
    riskLevel: 'medium',
  },
  {
    name: 'Exit Opportunity',
    description: 'Consider taking profits on Crypto position',
    time: '30m ago',
    icon: '🎯',
    color: '#FFB800',
    riskLevel: 'high',
  },
  {
    name: 'Market Analysis',
    description: 'Bonds showing strong buy signals',
    time: '1h ago',
    icon: '📊',
    color: '#00C9A7',
    riskLevel: 'low',
  },
]

notifications = Array.from({ length: 4 }, () => notifications).flat()

const getRiskBadgeColor = (risk: Item['riskLevel']) => {
  switch (risk) {
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
}

const Notification: FC<ComponentPropsWithoutRef<'figure'> & Item> = ({
  name,
  description,
  icon,
  color,
  time,
  riskLevel,
  className,
  ...props
}) => (
  <figure
    className={cn(
      'relative mx-auto min-h-fit w-full max-w-[500px] cursor-pointer overflow-hidden rounded-2xl p-4',
      'transition-all duration-200 ease-in-out hover:scale-[102%]',
      'bg-white/80 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
      'dark:bg-gray-900/40 dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className
    )}
    {...props}
  >
    <div className="flex flex-row items-center gap-3">
      <div
        className="flex size-10 items-center justify-center rounded-xl shadow-sm"
        style={{
          backgroundColor: color,
        }}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {time}
            </span>
          </figcaption>
          <span
            className={cn(
              'ml-2 rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              getRiskBadgeColor(riskLevel)
            )}
          >
            {riskLevel}
          </span>
        </div>
        <p className="text-sm font-normal text-gray-600 dark:text-white/60">
          {description}
        </p>
      </div>
    </div>
  </figure>
)

export function NotificationList({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg md:shadow-xl',
        className
      )}
      {...props}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  )
}
