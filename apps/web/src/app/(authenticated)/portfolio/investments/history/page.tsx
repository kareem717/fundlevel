import { Metadata } from "next";
import { AccountInvestmentsTable } from "../components/account-investments-table";

export const metadata: Metadata = {
  title: "History",
  description: "A record of all your investments",
};

export default async function InvestmentsHistoryPage() {
  //TODO: Implement
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Investment History</h1>
      <AccountInvestmentsTable />
    </div>
  )
}
