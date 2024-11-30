"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface StandoutProps {
  className?: string;
}

const features = [
  {
    title: "Interest and Debt-Free Models",
    description: "Access capital without the burden of interest or debt.",
  },
  {
    title: "Cutting-Edge Proprietary Technology",
    description:
      "Leverage advanced tools for seamless funding management and insights.",
  },
  {
    title: "Shariah Compliance",
    description:
      "Raise funds with confidence, knowing all opportunities align with ethical and religious standards.",
  },
  {
    title: "Support for All Business Sizes",
    description:
      "Cater to diverse business profiles, from startups to established enterprises.",
  },
  {
    title: "Ease of Use and Transparency",
    description:
      "Enjoy a user-friendly platform with clear, transparent processes and information.",
  },
];

const Standout: FC<StandoutProps> = ({ className = "" }) => {
  return (
    <section className={`w-full py-20 ${className}`}>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How we stand out
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-card shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Standout;
