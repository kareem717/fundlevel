"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@repo/ui/components/chart"
import { cn } from "@repo/ui/lib/utils"
export const description = "A stacked area chart"

const chartData = [
  { month: "January", business: 18.6, investors: 8 },
  { month: "February", business: 35, investors: 20 },
  { month: "March", business: 23.7, investors: 12 },
  { month: "April", business: 19, investors: 7.3 },
  { month: "May", business: 20.9, investors: 13 },
  { month: "June", business: 21.4, investors: 14 },
]
const chartConfig = {
  business: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  investors: {
    label: "Investors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export interface VentureOwnershipChartProps extends Omit<ComponentPropsWithoutRef<typeof ChartContainer>, "children" | "config"> {

};

export const VentureOwnershipChart: FC<VentureOwnershipChartProps> = ({ className, ...props }) => {
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
        <ChartLegend
          content={<ChartLegendContent />}
        />
        <Area
          dataKey="business"
          type="natural"
          fill="var(--color-business)"
          fillOpacity={0.4}
          stroke="var(--color-business)"
          stackId="a"
        />
        <Area
          dataKey="investors"
          type="natural"
          fill="var(--color-investors)"
          fillOpacity={0.4}
          stroke="var(--color-investors)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
