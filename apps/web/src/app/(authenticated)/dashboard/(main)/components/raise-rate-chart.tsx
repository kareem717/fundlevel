"use client"

import { ComponentPropsWithoutRef, FC, useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart"
import { cn } from "@/lib/utils"

export const description = "A donut chart with text"
const chartData = [
  { status: "active", rounds: 287, fill: "var(--color-active)" },
  { status: "successful", rounds: 173, fill: "var(--color-successful)" },
  { status: "failed", rounds: 190, fill: "var(--color-failed)" },
]
const chartConfig = {
  rounds: {
    label: "Rounds",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-3))",
  },
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-4))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig


export interface BusinessRaiseRateProps extends Omit<ComponentPropsWithoutRef<typeof ChartContainer>, "config" | "children"> {

};

export const BusinessRaiseRate: FC<BusinessRaiseRateProps> = ({ className, ...props }) => {
  const successRate = useMemo(() => {
    const total = chartData.reduce((acc, curr) => acc + curr.rounds, 0)
    const successful = chartData.find(r => r.status === "successful")?.rounds || 0
    return Math.round((successful / total) * 100)
  }, [])

  return (

    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square max-h-96", className)}
      {...props}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="rounds"
          nameKey="status"
          innerRadius={"50%"}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {successRate}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Successful
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};