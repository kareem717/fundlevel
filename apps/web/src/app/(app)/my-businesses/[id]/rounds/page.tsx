import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessRoundsTable } from "./components/business-rounds-table";
import { columns } from "./components/business-rounds-table/columns";

export default async function BusinessRoundsPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string, pageSize?: string, ventureId?: string } }) {
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
				<h1>My Rounds</h1>  
				<Link
					href={`/my-businesses/${businessId}/rounds/create`}
					className={buttonVariants()}
				>
					Create Round
				</Link>
			</div>
			<div className="max-w-screen-lg mx-auto">
				<BusinessRoundsTable columns={columns(businessId)} data={[]} id={businessId} />
			</div>
		</div>
	);
}
