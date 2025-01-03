import { FC } from 'react'
import { Container, Section } from '@/components/layout'
import { cn } from '@repo/ui/lib/utils'
import Balancer from 'react-wrap-balancer'

interface ValuePropProps {
  className?: string
}

type ValueConfig = {
  heading: string
  subheading: string
  points: string[]
}

const valueConfig: Record<string, ValueConfig> = {
  easy: {
    heading: 'Fast, straightforward, and inexpensive',
    subheading:
      'Invest seamlessly through our world-class platform with help at every step.',
    points: [
      'Invest from A-Z in as little as three minutes.',
      'All legal due diligence is handled by us in the background.',
      'Investments bare little to no fixed fees - disclosed simply and transparently.',
      'All business relationships are handled by us, taking all stress and responsibility away from you.',
      'Invest in a managed Portfolio™ for completely headache free returns.',
    ],
  },
  tooling: {
    heading: 'Technology to understand and analyze investments',
    subheading:
      'Utilize proprietary technology to have clarity during decision making.',
    points: [
      'Harness the power of AI and statistical analysis to evaluate investments.',
      'Deeply understand your decisions and options in a simple manner - no expertise required.',
      'Access enterprise level analytics.',
    ],
  },
  profitable: {
    heading: 'Generate real returns - not losses',
    subheading: 'Fully gauge risk to your tolerance.',
    points: [
      'Full risk disclosure for realistic expectations.',
      "Forecastable returns that don't disappoint.",
      'Simple liquidation opportunities.',
      'Short, medium and long exit horizons that satisfy your requirements.',
    ],
  },
  permissible: {
    heading: 'Shariah compliance at the core',
    subheading: 'Zero tolerance policy for non-compliance',
    points: [
      'All models validated by Islamic finance boards.',
      'Continuous business monitoring to ensure halal returns.',
      'Not just a feature, but a real personal commitment by the team.',
    ],
  },
}

const ValueProp: FC<ValuePropProps> = ({ className }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
            <Balancer>
              Access private markets{' '}
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                easily
              </span>
            </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            <Balancer>
              Investing in markets is lucrative, but it is not accessible to
              most.
            </Balancer>
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {Object.entries(valueConfig).map(([key, valuePoint], index) => (
            <ValueSection
              key={key}
              inverse={index % 2 === 0}
              valuePoint={valuePoint}
            />
          ))}
        </div>
      </Container>
    </Section>
  )
}

interface ValueSectionProps {
  inverse: boolean
  className?: string
  valuePoint: ValueConfig
}

const ValueSection: FC<ValueSectionProps> = ({
  className,
  inverse,
  valuePoint,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12">
      {/* Content Column */}
      <div className={cn('space-y-6', !inverse && 'lg:order-last')}>
        <div className="space-y-4">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            <Balancer>{valuePoint.heading} </Balancer>
          </h2>
          <p className="text-lg text-muted-foreground">
            <Balancer>{valuePoint.subheading}</Balancer>
          </p>
        </div>

        <ul className="space-y-4">
          {valuePoint.points.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 text-orange-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <Balancer className="text-muted-foreground">{point}</Balancer>
            </li>
          ))}
        </ul>
      </div>

      {/* Image Column */}
      <div className={cn('', !inverse && 'lg:order-first')}>
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950/30 dark:to-rose-950/30">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span>Image Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ValueProp }
