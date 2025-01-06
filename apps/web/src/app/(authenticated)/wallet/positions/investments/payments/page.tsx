import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description: "A record of all your investment payments",
};

export default async function InvestmentsHistoryPage() {
  //TODO: Implement
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Investment Payments</h1>
    </div>
  )
}
