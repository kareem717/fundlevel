import { BusinessInvestmentsTable } from "./components/business-investments-table";
import { columns } from "./components/business-investments-table/columns";

export default async function BusinessInvestmentsPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string, pageSize?: string, ventureId?: string } }) {
	const businessId = parseInt(params.id)
	if (isNaN(businessId)) {
		throw new Error("Invalid business id")
	}

	// const resp = await getBusinessVentures({
	// 	businessId,
	// 	pagination: {
	// 		offset: searchParams.page ? parseInt(searchParams.page) : 1,
	// 		limit: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
	// 	},
	// })

	// if (resp?.serverError || resp?.validationErrors) {
	// 	console.error(resp)
	// 	throw new Error(resp.serverError?.message || "Something went wrong")
	// }

	// const ventures = resp?.data?.ventures || []

	return (
		<div>
			<div className="flex justify-between items-center max-w-screen-lg mx-auto">
				<h1>My Recieved Investments</h1>  
			</div>
			<div className="max-w-screen-lg mx-auto">
				<BusinessInvestmentsTable columns={columns(businessId)} data={[]} id={businessId} />
			</div>
		</div>
	);
}
