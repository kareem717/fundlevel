"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { ExploreResource, useExploreNavbarStore } from "./use-explore-navbar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

export interface ExploreToggleProps extends ComponentPropsWithoutRef<"div"> {

};

export const ExploreToggle: FC<ExploreToggleProps> = ({ className, ...props }) => {
  const { resource, setResource } = useExploreNavbarStore()

  const resources: ExploreResource[] = ["Ventures", "Rounds"]

  return (
    <div className={cn("flex flex-col items-center gap-6", className)} {...props}>
      <ToggleGroup type="single" value={resource} onValueChange={(value) => setResource(value as ExploreResource)} className="w-full">
        {resources.map((resource) => (
          <ToggleGroupItem key={resource} value={resource} className="w-full">{resource}</ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};