import { ChartWrapper } from "@/components/ui/chart-wrapper";
import { InvestorTable } from "./components/investor-table";
import { ProfitStakeChart } from "./components/profit-stake-chart";
import { VentureOwnershipChart } from "./components/venture-ownership-chart";

export default function InvestorsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <InvestorTable />
      <div className="grid grid-cols-1 grid-rows-2 gap-4">
        <ChartWrapper
          title="Venture Ownership Over Time"
          description="Graphical visualization of the average equity percentage you own per venture over a time axis"
          className="w-full"
          headerClassName="items-start"
        >
          <VentureOwnershipChart />
        </ChartWrapper>
        <ChartWrapper
          title="Average Profit Stake"
          description="The average percentage of profits that go back to you per venture"
          className="w-full"
          headerClassName="items-start"
        >
          <ProfitStakeChart />
        </ChartWrapper>
      </div>
    </div>
  );
}
