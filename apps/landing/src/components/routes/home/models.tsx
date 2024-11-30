"use client";

import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef, FC } from "react";

const models = [
  {
    title: "Equity Financing",
    description:
      "Empowering investors to own a share of businesses, benefiting from dividends or capital growth.",
    color:
      "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-950/70",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Revenue/Profit Sharing",
    description:
      "Offering a share of business profits over time, ideal for cash-flow positive ventures.",
    color:
      "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-950/70",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "Asset Funding Arrangements",
    description:
      "Facilitating shared ownership of assets, generating profits from their use.",
    color:
      "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-950/70",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    title: "Mergers & Acquisitions",
    description:
      "Streamlining business growth and consolidation through strategic partnerships and acquisitions.",
    color:
      "bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/50 dark:hover:bg-orange-950/70",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
];

export const Models: FC<ComponentPropsWithoutRef<"section">> = ({
  className,
  ...props
}) => {
  return (
    <section className={cn("py-24 px-4", className)} {...props}>
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          INVESTMENT MODELS
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Our Services
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {models.map((model, index) => (
          <div
            key={index}
            className={cn(
              "group relative overflow-hidden rounded-2xl border transition-all duration-300",
              "p-6 h-[280px] flex flex-col justify-between",
              model.color,
              model.borderColor
            )}
          >
            <div className="space-y-4 transform transition-transform duration-300 group-hover:-translate-y-4">
              <h3 className="text-xl font-bold">{model.title}</h3>
              <p className="text-muted-foreground">{model.description}</p>
            </div>

            <div className="absolute bottom-6 left-6 transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <button className="text-primary font-medium hover:underline">
                Learn more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
