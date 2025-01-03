import { FC } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { Container, Section } from '@/components/layout'
import Balancer from 'react-wrap-balancer'

interface ProblemStatementProps {
  className?: string
}

const ProblemStatement: FC<ProblemStatementProps> = ({ className }) => {
  const stats = [
    {
      stat: '$10M',
      title: 'Minimum investment',
      description:
        'Many commercial private equity funds require immense capital investments to even work with them - barring most from reaping the gains in the growing market.',
    },
    {
      stat: '34.5M',
      title: 'Businesses in the US & Canada',
      description:
        'Out of the entire 34.5 million businesses, over 90% are considered small to medium.',
    },
    {
      stat: '44%',
      title: 'Businesses fail due to lack of capital',
      description:
        'Even when businesses have huge potential, simply running out of cash can destroy them.',
    },
  ]

  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              Private markets have{' '}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                outstanding potential
              </span>{' '}
              but are inaccessible or non-compliant.
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              There is over <span className="font-medium">$13 trillion</span>{' '}
              under management in private market investments, though very few
              are able to find opportunities for themselves - let alone while
              being shariah compliant.
            </Balancer>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

interface StatCardProps {
  stat: string
  title: string
  description: string
}

const StatCard: FC<StatCardProps> = ({ stat, title, description }) => {
  return (
    <div className="space-y-4 p-6 rounded-lg bg-secondary">
      <h4 className="text-3xl font-medium bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
        {stat}
      </h4>
      <h3>{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export { ProblemStatement }
