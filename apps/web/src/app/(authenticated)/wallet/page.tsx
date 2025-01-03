"use client"

import { Bell, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { PositionSnapshotChart } from "./components/position-snapshot-chart"
import { NotificationIndex } from "./components/notification-index"
import { RecentTransactionsList } from "./components/recent-transactions"
import { RecentInvestmentsList } from "./components/recent-investments"

export default function Component() {
  return (
    <div className="flex flex-col gap-4">
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
            <NotificationIndex className="h-[500px]" />
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 [&>*]:w-full [&>*]:h-min flex-grow">
        <Card >
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>A list of your recent investments</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentInvestmentsList className="h-72" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A list of your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactionsList className="h-72" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}