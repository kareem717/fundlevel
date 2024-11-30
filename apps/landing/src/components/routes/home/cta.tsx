"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React, { ComponentPropsWithoutRef, FC } from "react";

const items = [
  {
    header: "Invest",
    subheading: "Discover high growth investment opportunities.",
    description:
      "Access a range of shariah-compliant models, from revenue sharing to asset leasing, and grow your portfolio.",
    buttonText: "Learn More",
    image:
      "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-capital-desktop.png&w=828&q=75",
    url: "/invest",
  },
  {
    header: "Raise",
    subheading: "Secure capital without debt or interest.",
    description:
      "Connect with investors through equity crowdfunding, profit-sharing, and more. Grow your business ethically and efficiently.",
    buttonText: "Get Started",
    image:
      "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fproduct-selector%2Fproduct-selector-card-desktop.png&w=828&q=75",
    url: "/raise",
  },
];

export const CTA: FC<ComponentPropsWithoutRef<"section">> = ({
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section className={cn("py-24 px-4", className)} {...props}>
      <div className="">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            EMBEDDED FINANCE
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Meet our products
          </h2>
        </div>

        <div className="group flex max-md:flex-col justify-center gap-2 w-[80%] mx-auto mb-10 mt-3">
          {items.map((item, i: number) => (
            <div
              key={i}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "relative overflow-hidden rounded-2xl bg-[#E6E8FF]",
                activeIndex === i ? "w-full" : "w-1/2",
                "transition-all duration-500 ease-in-out"
              )}
            >
              {/* Content */}
              <div
                className={cn(
                  "relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[400px]",
                  activeIndex === i ? "w-2/3" : "w-full"
                )}
              >
                <div className="flex flex-col gap-2">
                  <ArrowUpRight className="h-8 w-8 bg-white rounded-md p-1" />
                  <h3
                    className={cn(
                      "text-3xl md:text-4xl font-bold transition-all duration-500",
                      activeIndex === i && "text-5xl md:text-6xl"
                    )}
                  >
                    {item.header}
                  </h3>
                </div>
                <p
                  className={cn(
                    "text-xl md:text-2xl transition-all duration-500 transform",
                    activeIndex === i ? "translate-y-4" : "translate-y-32"
                  )}
                >
                  {item.subheading}
                </p>
                <p
                  className={cn(
                    "text-gray-400 transition-all duration-500 transform",
                    activeIndex === i
                      ? "translate-y-8 opacity-100"
                      : "translate-y-full opacity-0"
                  )}
                >
                  {item.description}
                </p>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="bg-[#4F5DFF] text-white hover:bg-[#4F5DFF]/90"
                  >
                    {item.buttonText}
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div
                className={cn(
                  "absolute top-0 right-0 h-full transition-all duration-500 overflow-hidden p-2",
                  activeIndex === i ? "w-1/3" : "w-0"
                )}
              >
                <div className="rounded-lg overflow-hidden h-full w-full">
                  <Image
                    src={item.image}
                    alt={`${item.header} interface`}
                    width={800}
                    height={1200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
