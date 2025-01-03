import { meta } from '@/lib/config'
import { Container, Section } from '@/components/layout'
import { cn } from '@/lib/utils'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import { buttonVariants } from '@repo/ui/components/button'

export const metadata = meta.features

const featuresConfig = {
  wallet: {
    title: 'One place for all the assets you hold.',
    subtitle: 'Seamlessly manage and track your investments.',
    points: [
      'Consolidate all your investments in one secure digital wallet.',
      'Real-time updates on asset performance and value.',
      'Easy access to transaction history and statements.',
      'Multi-currency support for global investments.',
      'Enhanced security features to protect your assets.',
      'User-friendly interface for effortless navigation.',
    ],
    imagePosition: 'right',
  },
  portfolios: {
    title: 'Simple, stress-free investments.',
    subtitle: 'Managed investment funds handled for you.',
    points: [
      'Diversified portfolios tailored to your risk tolerance and goals.',
      'Professional management by experienced financial experts.',
      'Regular performance reviews and adjustments for optimal returns.',
      'Transparent fee structure with no hidden costs.',
      'Automated rebalancing to maintain your desired asset allocation.',
      'Access to exclusive investment opportunities.',
    ],
    imagePosition: 'left',
  },
  clarity: {
    title: 'Tools to make decision-making easy.',
    subtitle:
      'Proprietary tooling to provide insights into investment and risk management for all.',
    points: [
      'AI-driven analytics for comprehensive investment insights.',
      'Risk assessment tools to evaluate potential investments.',
      'Scenario analysis to forecast potential outcomes.',
      'Customizable dashboards for personalized data views.',
      'Real-time alerts for market changes and opportunities.',
      'Educational resources to enhance financial literacy.',
    ],
    imagePosition: 'right',
  },
  tokenization: {
    title: 'Represent assets in an easily exchangeable and divisible manner.',
    subtitle:
      'Utilize tokenization for investment agreements to allow for extremely high liquidity and mobilization of assets.',
    points: [
      'Convert physical assets into digital tokens for easy trading.',
      'Fractional ownership to lower investment barriers.',
      'Enhanced liquidity through blockchain technology.',
      'Secure and transparent transactions on a decentralized ledger.',
      'Simplified asset transfer and management.',
      'Access to a broader range of investment opportunities.',
    ],
    imagePosition: 'left',
  },
  numbers: {
    title: 'Technology to understand why your business is behaving how it is.',
    subtitle:
      'Suite of tools to help you interpret data points and see how your decisions have or will affect performance.',
    points: [
      'In-depth analytics to track business performance metrics.',
      'Predictive modeling to anticipate future trends.',
      'Visual data representation for easy interpretation.',
      'Benchmarking tools to compare against industry standards.',
      'Actionable insights to drive strategic decision-making.',
      'Integration with existing business systems for seamless data flow.',
    ],
    imagePosition: 'right',
  },
  legal: {
    title: 'Fast forward regulation and compliance.',
    subtitle:
      'Harness our out-of-the-box compliance support to raise funds quickly and legally.',
    points: [
      'Comprehensive compliance checks to meet regulatory standards.',
      'Streamlined KYC/AML processes for investor verification.',
      'Access to legal templates and documentation.',
      'Continuous monitoring for regulatory changes and updates.',
      'Expert legal support to navigate complex regulations.',
      'Assurance of Shariah compliance for ethical investments.',
    ],
    imagePosition: 'left',
  },
}

export default function FeaturesPage() {
  return (
    <main className="relative flex flex-col items-center w-full">
      <Section className="relative py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  <Balancer>
                    Powerful Features to{' '}
                    <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
                      Transform
                    </span>{' '}
                    Your Investment Journey
                  </Balancer>
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">
                  <Balancer>
                    Discover cutting-edge tools and technologies that make
                    investing and fundraising more accessible, efficient, and
                    rewarding than ever before.
                  </Balancer>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#explore"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:opacity-90'
                  )}
                >
                  Explore Features
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: 'lg', variant: 'outline' }),
                    'hover:bg-gradient-to-r hover:from-orange-400/10 hover:to-rose-400/10'
                  )}
                >
                  Get Started
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">
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
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rose-400">
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
                  <span>Asset Tokenization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-400">
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
                  <span>Compliance Support</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-lg bg-muted">
              {/* Image placeholder - replace with actual image */}
            </div>
          </div>
        </Container>
      </Section>
      {Object.entries(featuresConfig).map(([key, feature], index) => (
        <Section
          key={key}
          className={cn('py-24', index % 2 === 0 ? 'bg-gradient-to-br from-secondary to-secondary/50' : '')}
        >
          <Container>
            <div className={cn('grid lg:grid-cols-2 gap-12 items-center')}>
              <div
                className={cn(
                  'space-y-8',
                  feature.imagePosition === 'left' ? 'lg:order-2' : ''
                )}
              >
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-orange-400/10 text-orange-500 border border-orange-400/20 shadow-sm">
                    {key}
                  </div>
                  <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                    <Balancer>{feature.title}</Balancer>
                  </h2>
                  <p className="text-lg text-muted-foreground/90 sm:text-xl">
                    <Balancer>{feature.subtitle}</Balancer>
                  </p>
                </div>

                <ul className="space-y-4">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="text-cyan-500 mt-1 transition-transform duration-200 group-hover:scale-110">
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
                      <span className="text-muted-foreground/90 transition-colors duration-200 group-hover:text-cyan-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-square rounded-lg bg-gradient-to-br from-orange-50 via-cyan-50 to-rose-50 shadow-lg">
                {/* Image placeholder - replace with actual images */}
              </div>
            </div>
          </Container>
        </Section>
      ))}
    </main>
  )
}
