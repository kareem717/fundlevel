import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessesVenturesTable } from "./components/businesses-ventures-table";
import { columns } from "./components/businesses-ventures-table/columns";
import { getBusinessVentures } from "@/actions/busineses";

export default async function BusinessVenturesPage({ params, searchParams }: { params: { id: string }, searchParams: { page: string | undefined, pageSize: string | undefined } }) {
	const businessId = parseInt(params.id)
	if (isNaN(businessId)) {
		throw new Error("Invalid business id")
	}

	const resp = await getBusinessVentures({
		businessId,
		pagination: {
			offset: searchParams.page ? parseInt(searchParams.page) : 1,
			limit: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
		},
	})

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const ventures = resp?.data?.ventures || []

	return (
		<div>
			<div className="flex justify-between items-center max-w-screen-lg mx-auto">
				<h1>My Businesses</h1>
				<Link
					href={`/my-businesses/${businessId}/ventures/create`}
					className={buttonVariants()}
				>
					Create Venture
				</Link>
			</div>
			<div className="max-w-screen-lg mx-auto">
				<BusinessesVenturesTable columns={columns} data={ventures} id={businessId} />
			</div>
		</div>
	);
}
