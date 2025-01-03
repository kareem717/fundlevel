"use client"

import { StatisticCard } from "@/components/statistic-card";
import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"

export interface BusinessStatisticOverviewProps extends ComponentPropsWithoutRef<"div"> {

};

export const BusinessStatisticOverview: FC<BusinessStatisticOverviewProps> = ({ className, ...props }) => {
  return (
    <div className={cn("grid grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 gap-4 [&>div]:h-full", className)} {...props}>
      <StatisticCard
        title="Total Funding"
        value="$100,000"
        icon="dollarSign"
        description="This is the total funding for the business."
        tooltip="This is the total funding for the business."
      />
      <StatisticCard
        title="Total Favourites"
        value="230"
        icon="heart"
        description="This is the total amount of favorites your business has recieved."
      />
      <StatisticCard
        title="Active Rounds"
        value="5"
        icon="chart"
        description="This is the total amount of active rounds for the business."
      />
    </div>
  );
};