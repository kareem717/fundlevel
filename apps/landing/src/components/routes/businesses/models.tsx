import { FC } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout'
import { Balancer } from 'react-wrap-balancer'
import { Section } from '@/components/layout'

interface ModelsProps {
  className?: string
}

const modelsConfig = {
  crowdfunding: {
    title: 'Equity Crowdfunding',
    description:
      'Raise capital by offering shares to a broad audience without losing control. Get funding from investors who believe in your vision.',
  },
  revenue: {
    title: 'Revenue Sharing',
    description:
      'Share a portion of your revenue with investors, creating perfect alignment between business and investor success. A flexible funding option that grows with you.',
  },
  profit: {
    title: 'Profit-Sharing Partnerships',
    description:
      'Partner with investors who share in your profits, not your losses. Build true partnerships that incentivize mutual growth and success.',
  },
}

const Models: FC<ModelsProps> = ({ className }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              Funding{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Models
              </span>{' '}
              That Work
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              Choose from multiple ways to raise capital that align with your goals and
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
                <h3 className="text-xl sm:text-2xl font-medium bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
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

export default Models
