"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface ProblemProps {
  className?: string;
}

const problems = [
  {
    title: "High Cost of Capital",
    description:
      "Traditional financing often involves high interest rates and rigid repayment terms, which can stifle growth.",
  },
  {
    title: "Ownership Dilution",
    description:
      "Many businesses are forced to give up significant equity to secure funding, losing control over their vision.",
  },
  {
    title: "Limited Access to Ethical Funding",
    description:
      "Finding Shariah-compliant and ethical funding sources is challenging, limiting options for many businesses.",
  },
];

const Problem: FC<ProblemProps> = ({ className = "" }) => {
  return (
    <section className={`w-full py-20 bg-secondary/5 ${className}`}>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Businesses struggle to access capital without debt, interest, or
            diluting ownership.
          </h2>
          <p className="text-xl text-muted-foreground">
            Over 40% of businesses fail due to lacking access to capital. The
            ones that make it are forced to take on interest-bearing debt or
            sell ownership of the business.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg bg-card"
            >
              <h3 className="mb-4 text-xl font-semibold">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
