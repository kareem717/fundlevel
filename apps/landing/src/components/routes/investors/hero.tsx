import { FC } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

const HeroSection: FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn("container py-24 space-y-8", className)}>
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Invest hassle free in businesses that actually make returns.
        </h1>
        <p className="text-xl text-muted-foreground">
          Create stable income with unique models that are in everyones
          interest.
        </p>
        <Link href="#" className={cn(buttonVariants({ size: "lg" }))}>
          Get Started
        </Link>
      </div>
    </section>
  );
};

export { HeroSection };
