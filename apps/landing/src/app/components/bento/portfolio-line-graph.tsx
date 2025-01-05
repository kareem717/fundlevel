import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@repo/ui/lib/utils'

const chartData = [
  {
    date: "2023-01-01",
    value: 155467.06
  },
  {
    date: "2023-01-02",
    value: 241199.15
  },
  {
    date: "2023-01-03",
    value: 162307.58
  },
  {
    date: "2023-01-04",
    value: 223810.29
  },
  {
    date: "2023-01-05",
    value: 193236.03
  },
  {
    date: "2023-01-06",
    value: 273108.40
  },
  {
    date: "2023-01-07",
    value: 227638.63
  },
  {
    date: "2023-01-08",
    value: 254711.16
  },
  {
    date: "2023-01-09",
    value: 273742.54
  },
  {
    date: "2023-01-10",
    value: 278161.96
  },
  {
    date: "2023-01-11",
    value: 203725.89
  },
  {
    date: "2023-01-12",
    value: 215592.23
  },
  {
    date: "2023-01-13",
    value: 220686.74
  },
  {
    date: "2023-01-14",
    value: 257627.72
  },
  {
    date: "2023-01-15",
    value: 287452.62
  },
  {
    date: "2023-01-16",
    value: 247691.67
  },
  {
    date: "2023-01-17",
    value: 277305.15
  },
  {
    date: "2023-01-18",
    value: 292053.28
  },
  {
    date: "2023-01-19",
    value: 321960.29
  },
  {
    date: "2023-01-20",
    value: 340615.41
  }
]

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const percentageChange = (chartData[chartData.length - 1]!.value! - chartData[0]!.value!) / chartData[0]!.value! * 100

const formatCurrency = (value: any) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function PortfolioLineGraph({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]", className)} {...props} >
      <div className="flex items-center text-xl font-medium">
        {percentageChange.toFixed(2)}
        <span className="ml-1">%</span>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: any) => formatCurrency(value)}
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#gradient)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
              stackId="a"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
