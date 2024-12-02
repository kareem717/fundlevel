'use client'

import { motion } from 'framer-motion'
import { FC } from 'react'
import { Card } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { Container } from '@/components/layout'
import { Section } from '@/components/layout'
import { cn } from '@/lib/utils'
import Balancer from 'react-wrap-balancer'

interface ProblemProps {
  className?: string
}

const problems = [
  {
    icon: Icons.warning,
    title: 'High Cost of Capital',
    description:
      'Traditional financing often involves high interest rates and rigid repayment terms, which can stifle growth.',
  },
  {
    icon: Icons.pieChart,
    title: 'Ownership Dilution',
    description:
      'Many businesses are forced to give up significant equity to secure funding, losing control over their vision.',
  },
  {
    icon: Icons.clock,
    title: 'Limited Access to Ethical Funding',
    description:
      'Finding Shariah-compliant and ethical funding sources is challenging, limiting options for many businesses.',
  },
]

const Problem: FC<ProblemProps> = ({ className = '' }) => {
  return (
    <Section className={cn('', className)}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            Common Funding Challenges
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            <Balancer>
              Businesses face significant obstacles when seeking growth capital
              through traditional channels.
            </Balancer>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="p-6 bg-card/50 shadow-lg hover:bg-card/80 transition-colors">
                <div className="h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                  <problem.icon className="h-6 w-6 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export default Problem
