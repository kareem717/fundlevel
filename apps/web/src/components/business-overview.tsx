"use client";

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@fundlevel/ui/lib/utils";

export interface BusinessOverviewProps extends ComponentPropsWithoutRef<"div"> {
  overview: string;
  teamSize: string;
  businessId: number;
}

export function BusinessOverview({
  className,
  overview,
  teamSize,
  businessId,
  ...props
}: BusinessOverviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 items-start justify-center",
        className,
      )}
      {...props}
    >
      <div className="flex gap-4 text-sm sm:text-base">
        <Icons.building className="size-9 text-muted-foreground mt-1" />
        <div className="flex flex-col gap-1">
          Company Overview
          <span className="text-muted-foreground">{overview}</span>
        </div>
      </div>
      <div className="flex gap-4 text-sm sm:text-base">
        <Icons.users className="size-9 text-muted-foreground mt-1" />
        <div className="flex flex-col gap-1">
          Team Size
          <span className="text-muted-foreground">
            {teamSize} {teamSize === "1" ? "person" : "people"}
          </span>
        </div>
      </div>
    </div>
  );
}
