"use client";

import { FC, useState } from "react";
import { cn } from "@/lib/utils";

interface StandoutProps {
  className?: string;
}

const standoutConfig = {
  accessible: {
    title: "Accessible to Non-Accredited Investors",
    description: "Open up investment opportunities to everyone, regardless of accreditation status."
  },
  technology: {
    title: "Cutting-Edge Proprietary Technology",
    description: "Leverage advanced tools for seamless investment management and insights."
  },
  shariah: {
    title: "Shariah Compliance", 
    description: "Invest with confidence, knowing all opportunities align with ethical and religious standards."
  },
  diverse: {
    title: "Investors of All Shapes and Sizes",
    description: "Cater to diverse investor profiles, from individuals to institutions."
  },
  ease: {
    title: "Ease of Use and Transparency",
    description: "Enjoy a user-friendly platform with clear, transparent processes and information."
  }
};

const StandoutSection: FC<StandoutProps> = ({ className }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <section className={cn("container py-16 space-y-12", className)}>
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">
          How We Stand Out
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(standoutConfig).map(([key, item]) => (
          <div
            key={key}
            className="relative overflow-hidden rounded-xl border p-8 transition-all duration-500 hover:shadow-xl"
            onMouseEnter={() => setHoveredItem(key)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent transition-opacity duration-500",
                hoveredItem === key ? "opacity-100" : "opacity-0"
              )}
            />
            
            <div 
              className={cn(
                "relative transform transition-transform duration-500",
                hoveredItem === key ? "translate-y-[-8px]" : ""
              )}
            >
              <h3 className={cn(
                "text-xl font-bold mb-4 transition-colors duration-500",
                hoveredItem === key ? "text-primary" : ""
              )}>
                {item.title}
              </h3>
              
              <p className={cn(
                "text-muted-foreground transition-colors duration-500",
                hoveredItem === key ? "text-foreground" : ""
              )}>
                {item.description}
              </p>
            </div>

            <div 
              className={cn(
                "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500",
                hoveredItem === key ? "w-full" : "w-0"
              )} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export { StandoutSection };
