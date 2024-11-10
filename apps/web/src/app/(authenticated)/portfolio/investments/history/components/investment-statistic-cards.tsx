"use client"

import { format } from "date-fns"
import { StatisticCard } from "@/components/statistic-card"
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface InvestmentStatisticLineProps extends ComponentPropsWithoutRef<"div"> {}

export const LastInvestmentCard: FC<InvestmentStatisticLineProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const lastInvestment = new Date();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, Math.random() * 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StatisticCard
      isLoading={isLoading}
      title="Last Investment"
      value={isLoading ? "" : format(lastInvestment, "PPP")}
      icon="dollarSign"
      description="This is the total amount of investments you have made."
      className={className}
      {...props}
    />
  );
};

export const TotalInvestmentsCard: FC<InvestmentStatisticLineProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, Math.random() * 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StatisticCard
      isLoading={isLoading}
      title="Total Investments"
      value={isLoading ? "" : "10"}
      icon="dollarSign"
      description="This is the total amount of investments you have made."
      className={className}
      {...props}
    />
  );
};

export const InvestmentStatisticLine: FC<InvestmentStatisticLineProps> = ({ className, ...props }) => {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)} {...props}>
      <LastInvestmentCard />
      <TotalInvestmentsCard />
    </div>
  );
};