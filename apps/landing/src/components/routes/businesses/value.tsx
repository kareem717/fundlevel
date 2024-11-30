"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface ValueProps {
  className?: string;
}

const bentos = [
  {
    title: "Models",
    heading: "Raise strategically via models that make sense for you",
    subheading: "Select ways to raise capital that do not damage your business",
    points: [
      "Choose from equity crowdfunding, revenue sharing, and profit-sharing models.",
      "Maintain control and ownership while accessing necessary funds.",
      "Align your funding strategy with your business's ethical and growth objectives.",
    ],
  },
  {
    title: "Tooling",
    heading: "Advanced tools for business growth",
    subheading: "Leverage technology to optimize your funding and growth strategies.",
    points: [
      "Utilize AI-driven insights to match with the right investors.",
      "Access financial modeling and forecasting tools to plan effectively.",
      "Benefit from investor matching based on industry and preference.",
    ],
  },
  {
    title: "Support",
    heading: "Comprehensive support for success", 
    subheading: "Get the resources you need to thrive.",
    points: [
      "Streamlined onboarding and compliance processes.",
      "Access to business development resources and mentorship.",
      "Ongoing analytics to track performance and optimize returns.",
    ],
  },
  {
    title: "Permissible",
    heading: "Shariah compliance at the core",
    subheading: "Zero tolerance policy for non-compliance",
    points: [
      "All models validated by Islamic finance boards.",
      "Continuous business monitoring to ensure halal operations.", 
      "Not just a feature, but a real personal commitment by the team.",
    ],
  }
  // Add other bentos here...
];

const Value: FC<ValueProps> = ({ className = "" }) => {
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
            Raise Capital with Confidence
          </h2>
          <p className="text-xl text-muted-foreground">
            Secure funding that aligns with your business values and growth
            goals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {bentos.map((bento, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-lg bg-card shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{bento.heading}</h3>
              <p className="text-muted-foreground mb-4">{bento.subheading}</p>
              <ul className="space-y-2">
                {bento.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Value;
