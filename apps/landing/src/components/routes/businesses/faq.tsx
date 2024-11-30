"use client";

import { motion } from "framer-motion";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  className?: string;
}

const faqs = [
  {
    question: "How does interest-free funding work?",
    answer:
      "Our funding models are based on profit and revenue sharing agreements, where investors participate in the success of your business without charging interest. This aligns with both ethical finance principles and Shariah compliance.",
  },
  {
    question: "What types of businesses can apply?",
    answer:
      "We welcome businesses of all sizes and stages, from startups to established enterprises. The key requirements are a clear business model, growth potential, and alignment with ethical business practices.",
  },
  {
    question: "How long does the funding process take?",
    answer:
      "The typical funding process takes 4-6 weeks from application to funding. This includes due diligence, investor matching, and documentation. Our platform streamlines this process to make it as efficient as possible.",
  },
  {
    question: "What are the minimum and maximum funding amounts?",
    answer:
      "Funding amounts typically range from $50,000 to $5 million, depending on your business size, stage, and funding model chosen. We work with you to determine the optimal funding amount for your needs.",
  },
  {
    question: "How do you ensure Shariah compliance?",
    answer:
      "All our funding models are reviewed and approved by leading Islamic finance scholars. We maintain ongoing monitoring to ensure compliance throughout the funding lifecycle.",
  },
  {
    question: "What happens if my business underperforms?",
    answer:
      "Our revenue and profit-sharing models are designed to flex with your business performance. Unlike traditional loans, there's no fixed repayment burden during challenging periods.",
  },
];

const FAQ: FC<FAQProps> = ({ className = "" }) => {
  return (
    <section className={`w-full py-20 ${className}`}>
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Get answers to common questions about our funding process
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
