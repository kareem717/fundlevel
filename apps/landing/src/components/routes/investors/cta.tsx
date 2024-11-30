"use client";

import { FC, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CTAProps {
  className?: string;
}

const CTA: FC<CTAProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className={cn("relative overflow-hidden py-24", className)}>
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-gradient-shift" />

      {/* Floating shapes animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in">
              Transform Your Investment <br />
              <span className="text-primary">Portfolio Today</span>
            </h2>

            <p className="text-xl text-muted-foreground animate-fade-in-delay">
              Join sophisticated investors accessing exclusive private market
              opportunities with returns that outperform traditional
              investments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "relative group overflow-hidden",
                  "bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10">Start Investing Now</span>
                <div
                  className={cn(
                    "absolute inset-0 bg-primary-foreground/10 transition-transform duration-300",
                    isHovered ? "translate-x-0" : "-translate-x-full"
                  )}
                />
              </Link>

              <Link
                href="/learn-more"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground animate-fade-in-delay-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Vetted Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Shariah Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Expert Support</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-right">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="https://perawallet.s3.amazonaws.com/images/pera-web.png"
                alt="Investment Dashboard"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };
