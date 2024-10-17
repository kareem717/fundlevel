import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessRoundsTable } from "./components/business-rounds-table";
import { getBusinessRoundsByPage } from "@/actions/busineses";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";

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
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">My Rounds</h1>
				<Link
					href={redirects.app.myBusinesses.view.rounds.create.replace(":id", businessId.toString())}
					className={buttonVariants()}
				>
					<Icons.add className="size-4 mr-2" />
					Create
				</Link>
			</div>
			<BusinessRoundsTable data={rounds?.data?.rounds || []} businessId={businessId} />
		</div>
	);
}
