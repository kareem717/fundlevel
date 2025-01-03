'use client'

import { FC, useState } from 'react'
import { cn } from '@repo/ui/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, Section } from '@/components/layout'

interface FAQProps {
  className?: string
}

const faqConfig = {
  funding: {
    question: 'How does interest-free funding work?',
    answer:
      'Our funding models are based on profit and revenue sharing agreements, where investors participate in the success of your business without charging interest. This aligns with both ethical finance principles and Shariah compliance.',
  },
  businesses: {
    question: 'What types of businesses can apply?',
    answer:
      'We welcome businesses of all sizes and stages, from startups to established enterprises. The key requirements are a clear business model, growth potential, and alignment with ethical business practices.',
  },
  process: {
    question: 'How long does the funding process take?',
    answer:
      'The typical funding process takes 4-6 weeks from application to funding. This includes due diligence, investor matching, and documentation. Our platform streamlines this process to make it as efficient as possible.',
  },
  amounts: {
    question: 'What are the minimum and maximum funding amounts?',
    answer:
      'Funding amounts typically range from $50,000 to $5 million, depending on your business size, stage, and funding model chosen. We work with you to determine the optimal funding amount for your needs.',
  },
  compliance: {
    question: 'How do you ensure Shariah compliance?',
    answer:
      'All our funding models are reviewed and approved by leading Islamic finance scholars. We maintain ongoing monitoring to ensure compliance throughout the funding lifecycle.',
  },
  performance: {
    question: 'What happens if my business underperforms?',
    answer:
      "Our revenue and profit-sharing models are designed to flex with your business performance. Unlike traditional loans, there's no fixed repayment burden during challenging periods.",
  },
}

const FAQ: FC<FAQProps> = ({ className }) => {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <Section className={cn('bg-secondary/5', className)}>
      <Container>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h3>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Get answers to your questions about raising capital for your
            business
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
                  className="text-cyan-400"
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

export default FAQ
