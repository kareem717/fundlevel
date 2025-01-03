'use client'

import { cn } from '@repo/ui/lib/utils'
import { useState, useCallback } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart'
import NumberFlow from '@number-flow/react'

// Generate sample data with fewer points
const generateData = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
    value: 10 + Math.random() * 10 + Math.sin(i / 3) * 5,
  }))
}

const allData = generateData(30) // 30 data points for a month

export function Graph1() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)
  const [visibleDataStart, setVisibleDataStart] = useState(0)

  const visibleData = allData.slice(visibleDataStart, visibleDataStart + 10)

  const percentageChange = (
    ((visibleData[visibleData.length - 1].value - visibleData[0].value) /
      visibleData[0].value) *
    100
  ).toFixed(2)

  const handleMouseMove = useCallback((e: any) => {
    if (e.activePayload && e.activePayload[0]) {
      setHoveredValue(e.activePayload[0].payload.value)

      // Calculate new start index based on mouse position
      const chartWidth = (
        e.currentTarget as SVGGElement
      ).getBoundingClientRect().width
      const mouseX = e.nativeEvent.offsetX
      const newStartIndex = Math.floor(
        (mouseX / chartWidth) * (allData.length - 10)
      )
      setVisibleDataStart(
        Math.max(0, Math.min(newStartIndex, allData.length - 10))
      )
    }
  }, [])

  return (
    <Card className="w-full max-w-lg bg-black/95">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 text-emerald-400',
              'transition-transform duration-200',
              hoveredValue !== null ? 'scale-110' : ''
            )}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <CardTitle className="text-2xl">
              {hoveredValue !== null
                ? `${(((hoveredValue - visibleData[0].value) / visibleData[0].value) * 100).toFixed(2)}%`
                : `${percentageChange}%`}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visibleData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(153 60% 53%)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(153 60% 53%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(153 60% 53%)"
                strokeWidth={2}
                fill="url(#gradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Calculate percentage change
const percentageChange = (
  ((allData[allData.length - 1].value - allData[0].value) / allData[0].value) *
  100
).toFixed(2)

export function Graph2() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  return (
    <div className="flex flex-col [mask-image:linear-gradient(to_top,transparent_20%,#000_100%)]">
      <div className="flex items-center text-xl font-medium">
        <NumberFlow
          value={
            hoveredValue !== null
              ? Number(hoveredValue.toFixed(1))
              : Number(percentageChange)
          }
        />
        <span className="ml-1">%</span>
      </div>
      <ChartContainer
        config={{
          value: {
            label: 'Growth',
            // color: 'rgb(34, 211, 238, 0.8)',
          },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={allData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            onMouseMove={(e) => {
              if (e.activePayload) {
                setHoveredValue(e.activePayload[0].value)
              }
            }}
            onMouseLeave={() => setHoveredValue(null)}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="rgb(34, 211, 238, 0.8)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="rgb(34, 211, 238, 0.8)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="rgb(34, 211, 238, 0.8)"
              strokeWidth={2}
              fill="url(#gradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
    //     <ChartContainer
    //     config={{
    //       value: {
    //         label: 'Growth',
    //         color: 'hsl(153 60% 53%)',
    //       },
    //     }}
    //     className="h-[200px]"
    //   >
    //     <ResponsiveContainer width="100%" height="100%">
    //       <AreaChart
    //         data={data}
    //         margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
    //         onMouseMove={(e) => {
    //           if (e.activePayload) {
    //             setHoveredValue(e.activePayload[0].value)
    //           }
    //         }}
    //         onMouseLeave={() => setHoveredValue(null)}
    //       >
    //         <defs>
    //           <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
    //             <stop
    //               offset="0%"
    //               stopColor="hsl(153 60% 53%)"
    //               stopOpacity={0.2}
    //             />
    //             <stop
    //               offset="100%"
    //               stopColor="hsl(153 60% 53%)"
    //               stopOpacity={0}
    //             />
    //           </linearGradient>
    //         </defs>
    //         <XAxis dataKey="date" hide />
    //         <YAxis hide />
    //         <ChartTooltip content={<ChartTooltipContent hideLabel/>} />
    //         <Area
    //           type="monotone"
    //           dataKey="value"
    //           stroke="hsl(153 60% 53%)"
    //           strokeWidth={2}
    //           fill="url(#gradient)"
    //           animationDuration={300}
    //         />
    //       </AreaChart>
    //     </ResponsiveContainer>
    //   </ChartContainer>

    // <Card className="w-full max-w-lg">
    //   <CardHeader className="pb-4">
    //     <div className="flex items-center gap-2">
    //       <div
    //         className={cn(
    //           'flex items-center gap-1 text-emerald-400',
    //           'transition-transform duration-200',
    //           hoveredValue !== null ? 'scale-110' : ''
    //         )}
    //       >
    //         <svg
    //           className="h-4 w-4"
    //           fill="none"
    //           stroke="currentColor"
    //           viewBox="0 0 24 24"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth={2}
    //             d="M5 10l7-7m0 0l7 7m-7-7v18"
    //           />
    //         </svg>
    //         <CardTitle className="text-2xl">

    //         </CardTitle>
    //       </div>
    //     </div>
    //   </CardHeader>
    //   <CardContent>
    //     <ChartContainer
    //       config={{
    //         value: {
    //           label: 'Growth',
    //           color: 'hsl(153 60% 53%)',
    //         },
    //       }}
    //       className="h-[200px]"
    //     >
    //       <ResponsiveContainer width="100%" height="100%">
    //         <AreaChart
    //           data={data}
    //           margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
    //           onMouseMove={(e) => {
    //             if (e.activePayload) {
    //               setHoveredValue(e.activePayload[0].value)
    //             }
    //           }}
    //           onMouseLeave={() => setHoveredValue(null)}
    //         >
    //           <defs>
    //             <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
    //               <stop
    //                 offset="0%"
    //                 stopColor="hsl(153 60% 53%)"
    //                 stopOpacity={0.2}
    //               />
    //               <stop
    //                 offset="100%"
    //                 stopColor="hsl(153 60% 53%)"
    //                 stopOpacity={0}
    //               />
    //             </linearGradient>
    //           </defs>
    //           <XAxis dataKey="date" hide />
    //           <YAxis hide />
    //           <ChartTooltip content={<ChartTooltipContent />} />
    //           <Area
    //             type="monotone"
    //             dataKey="value"
    //             stroke="hsl(153 60% 53%)"
    //             strokeWidth={2}
    //             fill="url(#gradient)"
    //             animationDuration={300}
    //           />
    //         </AreaChart>
    //       </ResponsiveContainer>
    //     </ChartContainer>
    //   </CardContent>
    // </Card>
  )
}
