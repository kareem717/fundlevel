import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights",
  description: "Insights and analytics for your investments",
};

export default async function InvestmentsInsightsPage() {
  //TODO: Implement
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Investment Insights</h1>
    </div>
  )
}
