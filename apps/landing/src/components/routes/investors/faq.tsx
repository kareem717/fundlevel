'use client'

import { FC, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, Section } from '@/components/layout'

interface FAQSectionProps {
  className?: string
}

const faqConfig = {
  investing: {
    question: 'How does investing work on your platform?',
    answer:
      'Our platform enables direct investment into vetted private market opportunities. You can browse available deals, review detailed information, and invest entirely online. We handle all legal documentation and payment processing. Minimum investments vary by opportunity.',
  },
  returns: {
    question: 'What kind of returns can I expect?',
    answer:
      'Returns vary by investment type and specific opportunity. Revenue sharing typically yields 8-15% annually, while equity investments have higher potential but longer time horizons. We provide detailed projections and risk analysis for each opportunity.',
  },
  compliance: {
    question: 'How do you ensure Shariah compliance?',
    answer:
      'Every investment opportunity undergoes rigorous Shariah screening by qualified scholars. We monitor ongoing compliance and have strict criteria for business operations, debt levels, and revenue sources. Our process is fully transparent and documented.',
  },
  minimum: {
    question: 'What are the minimum investment amounts?',
    answer:
      'Minimums vary by opportunity, starting from as low as $1,000 for some crowdfunding deals. Traditional private equity deals typically start at $25,000. We aim to make opportunities accessible while ensuring meaningful investment sizes.',
  },
  liquidity: {
    question: 'How can I exit my investment?',
    answer:
      'Exit options depend on the investment type. Revenue sharing provides regular distributions. For equity investments, we work to create secondary market opportunities and structure clear exit timelines, typically 3-7 years.',
  },
  fees: {
    question: 'What fees do you charge?',
    answer:
      'We maintain a transparent fee structure with no hidden costs. Most investments have a small platform fee (1-2%) and potential success fees on profits. All fees are clearly disclosed before investment.',
  },
}

const FAQSection: FC<FAQSectionProps> = ({ className }) => {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <Section className={cn('', className)}>
      <Container>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h3>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Get answers to common questions about investing through our platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {Object.entries(faqConfig).map(([key, item]) => (
            <div key={key} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenItem(openItem === key ? null : key)}
                className={cn(
                  'w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-300',
                  openItem === key ? 'bg-secondary' : 'hover:bg-secondary/50'
                )}
              >
                <span className="text-lg font-medium">{item.question}</span>
                <motion.span
                  animate={{ rotate: openItem === key ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-orange-400"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {openItem === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 py-4 text-muted-foreground border-t">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export { FAQSection }
