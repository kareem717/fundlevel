"use client"

import { Bell, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PositionSnapshotChart } from "./components/position-snapshot-chart"
import { NotificationIndex } from "./components/notification-index"

const recentInvestments = [
  {
    id: 1,
    symbol: "AAPL",
    amount: 5000,
    type: "buy",
    date: "2024-11-10",
  },
  {
    id: 2,
    symbol: "GOOGL",
    amount: 3000,
    type: "buy",
    date: "2024-11-09",
  },
  {
    id: 3,
    symbol: "TSLA",
    amount: 2000,
    type: "sell",
    date: "2024-11-08",
  },
]

const recentPayments = [
  {
    id: 1,
    type: "Deposit",
    amount: 10000,
    status: "completed",
    date: "2024-11-10",
  },
  {
    id: 2,
    type: "Withdrawal",
    amount: 5000,
    status: "pending",
    date: "2024-11-09",
  },
  {
    id: 3,
    type: "Dividend",
    amount: 150,
    status: "completed",
    date: "2024-11-08",
  },
]

export default function Component() {
  return (
    <div className="flex flex-col gap-4 size-full">
      <h1 className="text-2xl font-semibold">Hey, Kareem!</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 h-auto">
          <CardHeader>
            <CardTitle>Position Snapshot</CardTitle>
            <CardDescription>A snapshot of your current positions</CardDescription>
          </CardHeader>
          <CardContent>
            <PositionSnapshotChart className="h-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>A list of your current notifications</CardDescription>
          </CardHeader>
          <CardContent className="py-0">
            <NotificationIndex className="max-h-[600px]" />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 h-full [&>*]:w-full h-content">
        <Card>
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>A list of your recent investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvestments.map((investment) => (
                <div key={investment.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{investment.symbol}</p>
                    <p className="text-xs text-muted-foreground">{investment.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {investment.type === "buy" ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">${investment.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>A list of your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">{payment.type}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">${payment.amount.toLocaleString()}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${payment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}