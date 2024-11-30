"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FC } from "react";

interface HeroProps {
  className?: string;
}

const Hero: FC<HeroProps> = ({ className = "" }) => {
  return (
    <section
      className={`w-full min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-primary/5 to-background ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-6xl text-center"
      >
        <h1 className="mb-6 text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text">
          Access interest and debt free capital while preserving ownership
        </h1>
        <p className="max-w-3xl mx-auto mb-8 text-xl md:text-2xl text-muted-foreground">
          Raise funds in ways that don&apos;t make you carry all of the risk,
          and give all of the reward to the investor.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="px-8 text-lg">
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
