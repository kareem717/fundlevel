"use client"

import { ComponentPropsWithoutRef, FC, useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart"
import { cn } from "@repo/ui/lib/utils"

const chartData = [
  { status: "pending", investments: 0, fill: "var(--color-active)" },
  { status: "successful", investments: 2, fill: "var(--color-successful)" },
]
const chartConfig = {
  investments: {
    label: "Investments",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export interface InvestmentStatusBreakdownChartProps extends ComponentPropsWithoutRef<"div"> {

};

export const InvestmentStatusBreakdownChart: FC<InvestmentStatusBreakdownChartProps> = ({ className, ...props }) => {
  const successRate = useMemo(() => {
    const total = chartData.reduce((acc, curr) => acc + curr.investments, 0)
    const successful = chartData.find(r => r.status === "successful")?.investments || 0
    return Math.round((successful / total) * 100)
  }, [])

  return (

    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto max-h-96", className)}
      {...props}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="investments"
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