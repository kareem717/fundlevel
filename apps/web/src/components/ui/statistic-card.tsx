"use client"

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { Card } from "./card";
import { Icons } from "./icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export interface StatisticCardProps extends ComponentPropsWithoutRef<typeof Card> {
  title: string;
  value: string;
  icon: keyof typeof Icons;
  description: string;
  tooltip?: string;
};

export const StatisticCard: FC<StatisticCardProps> = ({ className, title, value, icon, description, tooltip, ...props }) => {
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
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs">{description}</span>
      </div>
    </Card>
  );
};