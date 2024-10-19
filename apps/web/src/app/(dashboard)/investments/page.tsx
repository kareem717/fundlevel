import { AccountInvestmentsTable } from "./components/account-investments-table";

export const dynamic = 'force-dynamic'

export default async function InvestmentsPage() {
	return (
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto space-y-4">
			<h1 className="text-2xl font-bold">My Investments</h1>
			<AccountInvestmentsTable />
		</div>
	);
}
