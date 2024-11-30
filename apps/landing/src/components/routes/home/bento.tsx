"use client";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FC, ComponentPropsWithoutRef } from "react";

const bentoItems = [
  {
    id: 1,
    title: "Wallet",
    color: "bg-blue-50 dark:bg-blue-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Wallet</h3>
        <p className="text-muted-foreground">
          A centralized hub to manage all your assets seamlessly.
        </p>
      </div>
    ),
    width: 1,
    height: 2,
  },
  {
    id: 2,
    title: "Portfolios™",
    color: "bg-purple-50 dark:bg-purple-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Portfolios™</h3>
        <p className="text-muted-foreground">
          Professionally managed funds, including private equity, venture, and
          crypto, where you can invest with confidence.
        </p>
      </div>
    ),
    width: 2,
    height: 2,
  },
  {
    id: 6,
    title: "Insights™",
    color: "bg-yellow-50 dark:bg-yellow-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Insights™</h3>
        <p className="text-muted-foreground">
          Advanced analytics and reporting tools to make data-driven investment
          decisions.
        </p>
      </div>
    ),
    width: 1,
    height: 4,
  },
  {
    id: 3,
    title: "Clarity™",
    color: "bg-emerald-50 dark:bg-emerald-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Clarity™</h3>
        <p className="text-muted-foreground">
          Our proprietary stack for investment and risk analysis, providing
          unparalleled insights and transparency.
        </p>
      </div>
    ),
    width: 2,
    height: 2,
  },
  {
    id: 5,
    title: "Legal",
    color: "bg-red-50 dark:bg-red-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Legal</h3>
        <p className="text-muted-foreground">
          Comprehensive handling of all legal aspects, ensuring compliance and
          peace of mind.
        </p>
      </div>
    ),
    width: 1,
    height: 1,
  },

  {
    id: 4,
    title: "Tokenization",
    color: "bg-orange-50 dark:bg-orange-950/50",
    element: (
      <div className="flex flex-col justify-between h-full p-6">
        <h3 className="text-xl font-bold">Tokenization</h3>
        <p className="text-muted-foreground">
          Transform contracts into digital tokens for enhanced security and
          efficiency.
        </p>
      </div>
    ),
    width: 1,
    height: 1,
  },
];

export const BentoFeatures: FC<ComponentPropsWithoutRef<"section">> = ({
  className,
  ...props
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <section className={cn("py-24 px-4", className)} {...props}>
      <div className="text-center mb-16">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          PLATFORM FEATURES
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Powerful Tools & Features
        </h2>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:grid-rows-4">
        {bentoItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              `${item?.color ?? "bg-white"} p-4 rounded-2xl overflow-hidden`
            )}
            style={{
              gridColumn: `span ${item.width}`,
              gridRow: `span ${item.height}`,
              ...(isMobile && {
                gridColumn: "span 1",
                gridRow: "span 1",
              }),
            }}
          >
            {item.element}
          </div>
        ))}
      </div>
    </section>
  );
};
