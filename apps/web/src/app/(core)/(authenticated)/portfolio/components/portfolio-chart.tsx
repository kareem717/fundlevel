"use client"

import { ComponentPropsWithoutRef } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart"
import { cn } from "@repo/ui/lib/utils"
import { Aggregate } from "@repo/sdk"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"
export const description = "A stacked area chart"

const chartConfig = {
  value_usd_cents: {
    label: "Value",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export interface PortfolioChartProps extends Omit<ComponentPropsWithoutRef<typeof ChartContainer>, "config" | "children"> {
  data: Aggregate[]
}

export function PortfolioChart({ className, data, ...props }: PortfolioChartProps) {
  return (
    <ChartContainer config={chartConfig} className={cn("h-[50dvh] md:h-[35dvh] w-full", className)} {...props}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(value, "MM/yy")}
        />
        <YAxis
          tickMargin={8}
          tickCount={5}
          tickFormatter={(value) => formatCurrency(value as number / 100, "USD", "en-US")}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              formatter={
                (value) => formatCurrency(value as number / 100, "USD", "en-US")
              }
              labelFormatter={(value) => format(value as Date, "MMM yyyy")}
            />}
        />
        <Area
          dataKey="value_usd_cents"
          type="linear"
          fill="var(--color-value_usd_cents)"
          fillOpacity={0.4}
          stroke="var(--color-value_usd_cents)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
