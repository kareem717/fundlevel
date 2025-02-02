import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { PortfolioChart } from "./components/portfolio-chart"
import { RecentTransactionsList } from "./components/recent-payments-table"
import { getAccountInvestmentsAction } from "@/actions/investment";
import { Suspense } from "react"
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Badge } from "@repo/ui/components/badge";
import { format } from "date-fns";

async function Investments() {
  const investments = (await getAccountInvestmentsAction({
    cursor: 1,
    limit: 10,
  }))?.data?.investments ?? [];


  return (
    <ScrollArea className="space-y-4" type="scroll" >
      {investments.map((investment) => (
        <div key={investment.id} className="flex items-center justify-between pb-4 border-b last:border-0">
          <div className="space-y-1">
            <p className="text-sm font-medium">{investment.round_id}</p>
            <p className="text-xs text-muted-foreground">{format(investment.created_at, "MMM d, yyyy")}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">${(investment.total_usd_cent_value / 100).toLocaleString()}</span>
            {(() => {
              switch (investment.status) {
                case "completed":
                  return <Badge>Completed</Badge>;
                case "awaiting_payment":
                case "awaiting_confirmation":
                  return <Badge variant="outline">Pending</Badge>;
                default:
                  return <Badge variant="destructive">Withdrawn</Badge>;
              }
            })()}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default async function PortfolioPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Hey, Kareem!</h1>
      <Card className="col-span-2 h-auto">
        <CardHeader>
          <CardTitle>Position Snapshot</CardTitle>
          <CardDescription>A snapshot of your current positions</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioChart className="h-full" />
        </CardContent>
      </Card>
      <div className="flex gap-4 [&>*]:w-full [&>*]:h-min flex-grow">
        <Card >
          <CardHeader>
            <CardTitle>Recent Investments</CardTitle>
            <CardDescription>A list of your recent investments</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <Investments />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A list of your recent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <RecentTransactionsList className="h-72" />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}