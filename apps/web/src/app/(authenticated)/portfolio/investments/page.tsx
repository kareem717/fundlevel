import { Metadata } from "next";
import { AccountInvestmentsTable } from "../../../../actions/account-investments-table";

export const metadata: Metadata = {
  title: "Investments",
  description: "All investments are listed here",
};

export default async function InvestmentsPage() {
  //TODO: Implement
  return (
    <div>
      <h1>Investments</h1>
      <AccountInvestmentsTable />
    </div>
  )
}
