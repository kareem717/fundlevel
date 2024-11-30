"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FC } from "react";

interface CTAProps {
  className?: string;
}

const CTA: FC<CTAProps> = ({ className = "" }) => {
  return (
    <section className={`w-full py-20 bg-primary/5 ${className}`}>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="text-lg px-8">
              Raise Funds
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
