"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface ModelsProps {
  className?: string;
}

const modelsList = [
  {
    title: "Equity Crowdfunding",
    description:
      "Raise capital by offering shares to a broad audience without losing control.",
  },
  {
    title: "Revenue Sharing",
    description:
      "Share a portion of your revenue with investors, aligning their success with yours.",
  },
  {
    title: "Profit-Sharing Partnerships",
    description:
      "Partner with investors who share in your profits, not your losses.",
  },
];

const Models: FC<ModelsProps> = ({ className = "" }) => {
  return (
    <section className={`w-full py-20 bg-secondary/5 ${className}`}>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Models For Businesses
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {modelsList.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-lg bg-card shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">{model.title}</h3>
              <p className="text-muted-foreground">{model.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Models;
