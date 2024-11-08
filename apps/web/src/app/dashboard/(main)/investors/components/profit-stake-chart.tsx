"use client"

import { ComponentPropsWithoutRef, FC, useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export const description = "A donut chart with text"
const chartData = [
  { stake: "businessStake", percentage: 173, fill: "var(--color-businessStake)" },
  { stake: "investorStake", percentage: 190, fill: "var(--color-investorStake)" },
]
const chartConfig = {
  stake: {
    label: "Stake",
  },
  businessStake: {
    label: "Business Stake",
    color: "hsl(var(--chart-3))",
  },
  investorStake: {
    label: "Investor Stake",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig


export interface ProfitStakeChartProps extends Omit<ComponentPropsWithoutRef<typeof ChartContainer>, "config" | "children"> {

};

export const ProfitStakeChart: FC<ProfitStakeChartProps> = ({ className, ...props }) => {
  const profitStake = useMemo(() => {
    const owned = chartData.reduce((acc, curr) => acc + curr.percentage, 0)
    const unowned = chartData.find(r => r.stake === "investorStake")?.percentage || 0
    return Math.round((unowned / owned) * 100)
  }, [])

  return (

    <ChartContainer
      config={chartConfig}
      className={cn("mx-auto aspect-square max-h-[500px]", className)}
      {...props}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="percentage"
          nameKey="stake"
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
                      {profitStake}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Profit Stake
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