import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout'
import { Balancer } from 'react-wrap-balancer'
import { Section } from '@/components/layout'

interface ModelsSectionProps {
  className?: string
}

const modelsConfig = {
  revenue: {
    title: 'Revenue/Profit Sharing',
    description:
      'Purchase and own a part of a businesses profits or revenue. Work in a real partnership that creates the optimal aspects of being a equity owner.',
  },
  equity: {
    title: 'Equity Financing',
    description:
      'Purchase real ownership in a business. Become a large stakeholder through low investor count ventures, or invest with extremely low minimums via crowdfunding rounds.',
  },
  asset: {
    title: 'Asset funding',
    description:
      "Supply funding for assets that enable businesses to generate profits and benefit for providing working capital that truly works. You're not just investing in a business - your really partnering with it.",
  },
}

const ModelsSection: FC<ModelsSectionProps> = ({ className }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              Investment{' '}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                Models
              </span>{' '}
              That Work
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              Choose from multiple ways to invest that align with your goals and
              values
            </Balancer>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(modelsConfig).map(([key, model]) => (
            <div
              key={key}
              className="group relative overflow-hidden rounded-lg bg-secondary p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                  {model.title}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground">
                  <Balancer>{model.description}</Balancer>
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { ModelsSection }
