"use client";

import { EmptySectionCard } from "@/components/empty-section-card";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Round } from "@repo/sdk";
import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"

export interface ActiveRoundsSectionProps extends ComponentPropsWithoutRef<"section"> {

};

export const ActiveRoundsSection: FC<ActiveRoundsSectionProps> = ({ className, ...props }) => {
  const [rounds] = useState<Round[]>([]);
  const [isExecuting, setIsExecuting] = useState(true);

  useEffect(() => {
    //simulate loading
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  }, []);


  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      <Label className="text-2xl font-semibold">Active Rounds</Label>
      {isExecuting ? (
        <div className="grid grid-flow-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full aspect-square" />
          ))}
        </div>
      ) : rounds.length === 0 ? (
        <EmptySectionCard
          title="No rounds... yet!"
          description="Create a round to start raising capital"
          button={{
            label: "Create Round",
            //todo: add proper redirect
            href: "#",
          }}
          icon="chart"
          image={{
            src: "/filler.jpeg",
            alt: "No rounds",
          }}
        />
      ) : (
        <>
          Rounds
        </>
      )}
    </section>
  );
};