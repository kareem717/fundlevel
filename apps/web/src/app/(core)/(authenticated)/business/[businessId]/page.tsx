import { ChartWrapper } from "@/components/chart-wrapper";
import { BusinessImpressionAnalytics } from "./components/impression-analytics-chart";
import { KeyInvestorsTable } from "./components/key-investors-table";
import { BusinessRaiseRate } from "./components/raise-rate-chart";
import { BusinessStatisticOverview } from "./components/statistic-overview";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/card";

export default function BusinessDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <BusinessStatisticOverview />
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2  h-min">
          <ChartWrapper
            title="Impression Analytics"
            description="January - June 2024"
            headerClassName="items-start"
            className="w-full"
          >
            <BusinessImpressionAnalytics className="pb-4" />
          </ChartWrapper>
          <ChartWrapper
            title="Raise Rate"
            description="All time raise rate for this business"
            className="w-full"
            headerClassName="items-start"
          >
            <BusinessRaiseRate />
          </ChartWrapper>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Key Investors</CardTitle>
            <CardDescription>
              View all investors for this business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeyInvestorsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
