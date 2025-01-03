"use client";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Round } from "@repo/sdk";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"

export interface PastRoundsSectionProps extends ComponentPropsWithoutRef<"section"> {

};

export const PastRoundsSection: FC<PastRoundsSectionProps> = ({ className, ...props }) => {
  const [rounds] = useState<Round[]>([]);
  const [isExecuting, setIsExecuting] = useState(true);


  useEffect(() => {
    //simulate loading
    setTimeout(() => {
      setIsExecuting(false);
    }, 1000);
  }, []);

  if (!isExecuting && rounds.length === 0) return null;
  return (
    <section className={cn("flex flex-col gap-4", className)} {...props}>
      <Label className="text-2xl font-semibold">Past Rounds</Label>
      {isExecuting ? (
        <div className="grid grid-flow-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full aspect-square" />
          ))}
        </div>
      ) : (
        <>
          Rounds
        </>
      )}
    </section>
  );
};