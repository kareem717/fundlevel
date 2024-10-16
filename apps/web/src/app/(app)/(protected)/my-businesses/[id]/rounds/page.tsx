import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessRoundsTable } from "./components/business-rounds-table";
import { getBusinessRoundsByPage } from "@/actions/busineses";

export default async function BusinessRoundsPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string, pageSize?: string, ventureId?: string } }) {
	const businessId = parseInt(params.id)
	if (isNaN(businessId)) {
		throw new Error("Invalid business id")
	}

	const rounds = await getBusinessRoundsByPage(
		{
			businessId,
			pagination: {
				page: searchParams.page ? parseInt(searchParams.page) : 1,
				pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
			}
		})

	if (rounds?.serverError || rounds?.validationErrors) {
		console.error(rounds)
		throw new Error("Failed to fetch rounds")
	}

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
				<BusinessRoundsTable data={rounds?.data?.rounds || []} businessId={businessId} />
			</div>
		</div>
	);
}
