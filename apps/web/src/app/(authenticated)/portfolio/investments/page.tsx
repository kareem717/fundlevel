import { Metadata } from "next";
import { AccountInvestmentsTable } from "./components/account-investments-table";

export const metadata: Metadata = {
  title: "Investments",
  description: "All investments are listed here",
};

export default async function InvestmentsPage() {
  //TODO: Implement
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Investment History</h1>
      <AccountInvestmentsTable />
    </div>
  )
}
