"use client"

import { ComponentPropsWithoutRef } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart"
import { cn } from "@repo/ui/lib/utils"
export const description = "A stacked area chart"

const chartData = [
  { month: "January", total: 186, unique: 80 },
  { month: "February", total: 350, unique: 200 },
  { month: "March", total: 237, unique: 120 },
  { month: "April", total: 190, unique: 73 },
  { month: "May", total: 209, unique: 130 },
  { month: "June", total: 214, unique: 140 },
]
const chartConfig = {
  unique: {
    label: "Unique",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function PortfolioChart({ className, ...props }: Omit<ComponentPropsWithoutRef<typeof ChartContainer>, "children" | "config">) {
  return (
    <ChartContainer config={chartConfig} className={cn("h-[50dvh] md:h-[35dvh] w-full", className)} {...props}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="total"
          type="natural"
          fill="var(--color-total)"
          fillOpacity={0.4}
          stroke="var(--color-total)"
          stackId="a"
        />
        <Area
          dataKey="unique"
          type="natural"
          fill="var(--color-unique)"
          fillOpacity={0.4}
          stroke="var(--color-unique)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
