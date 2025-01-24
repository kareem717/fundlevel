import { Metadata } from "next";
import { InvestmentStatusBreakdownChart } from "./components/investment-status-breakdown-chart";
import { ChartWrapper } from "@/components/chart-wrapper";
import { LastInvestmentCard, TotalInvestmentsCard } from "./components/investment-statistic-cards";

export const metadata: Metadata = {
  title: "History",
  description: "A record of all your investments",
};

export default async function InvestmentsHistoryPage() {
  //TODO: Implement
  // set to 2 days ago
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-4 w-3/4 [&>*]:h-full">
          <LastInvestmentCard />
          <TotalInvestmentsCard />
        </div>
        <ChartWrapper
          className="w-1/4"
          title="Investment Status"
          description="All time raise rate for this business"
          headerClassName="items-start"
        >
          <InvestmentStatusBreakdownChart />
        </ChartWrapper>
      </div>
    </div>
  )
}
