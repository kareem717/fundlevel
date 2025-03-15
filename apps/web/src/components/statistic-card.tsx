"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react";
import { Card } from "@workspace/ui/components/card";
import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Skeleton } from "@workspace/ui/components/skeleton";

export interface StatisticCardProps
  extends ComponentPropsWithoutRef<typeof Card> {
  title: string;
  value: string;
  icon: keyof typeof Icons;
  description: string;
  tooltip?: string;
  isLoading?: boolean;
}

export const StatisticCard: FC<StatisticCardProps> = ({
  className,
  title,
  value,
  icon,
  description,
  tooltip,
  isLoading,
  ...props
}) => {
  const Icon = Icons[icon];

  return (
    <Card className={cn("flex flex-col gap-4 p-6", className)} {...props}>
      <div className="flex items-center gap-2 w-full justify-between">
        <span className="text-sm font-medium flex items-center justify-center gap-1">
          {title}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icons.info className="size-3.5 text-muted-foreground hover:text-accent-foreground hover:cursor-pointer transition-colors" />
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <Skeleton className="h-12 mb-2 w-1/3" />
        ) : (
          <span className="text-2xl font-bold">{value}</span>
        )}
        <span className="text-xs">{description}</span>
      </div>
    </Card>
  );
};
