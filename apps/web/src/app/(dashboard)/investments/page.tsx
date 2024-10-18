import { getAccountInvestmentsByPage } from "@/actions/investments";
import { InvestmentsTable } from "./components/investments-table";
import { columns } from "./components/investments-table/columns";
import { Suspense } from "@/components/ui/suspense";

export default async function InvestmentsPage({ searchParams }: { searchParams: { page: string | undefined, pageSize: string | undefined } }) {
	const resp = await getAccountInvestmentsByPage({
		page: searchParams.page ? parseInt(searchParams.page) : 1,
		pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
	})

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const investments = resp?.data?.investments || []

	return (
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto">
			<h1 className="text-2xl font-bold">My Investments</h1>
			<Suspense orientation="landscape" fallbackProps={{ className: "max-w-none" }}>
				<InvestmentsTable columns={columns} data={investments} />
			</Suspense>
		</div>
	);
}
