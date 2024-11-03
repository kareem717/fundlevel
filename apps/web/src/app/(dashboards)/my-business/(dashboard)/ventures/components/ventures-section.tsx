"use client";

import { EmptySectionCard } from "@/components/ui/empty-section-card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Venture } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"

export interface VenturesSectionProps extends ComponentPropsWithoutRef<"section"> {

};

export const VenturesSection: FC<VenturesSectionProps> = ({ className, ...props }) => {
  const [ventures] = useState<Venture[]>([]);
  const [isExecuting, setIsExecuting] = useState(true);

  useEffect(() => {
    //simulate loading
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  }, []);


  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      <Label className="text-2xl font-semibold">Ventures</Label>
      {isExecuting ? (
        <div className="grid grid-flow-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full aspect-square" />
          ))}
        </div>
      ) : ventures.length === 0 ? (
        <EmptySectionCard
          title="Nothing here..."
          description="Create a venture to expand your business"
          button={{
            label: "Create Venture",
            href: redirects.app.myBusinesses.view.ventures.create,
          }}
          icon="store"
          image={{
            src: "/filler.jpeg",
            alt: "No ventures",
          }}
        />
      ) : (
        <>
          Ventures
        </>
      )}
    </section>
  );
};