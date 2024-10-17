import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessesVenturesTable } from "./components/businesses-ventures-table";
import { columns } from "./components/businesses-ventures-table/columns";
import { getBusinessVentures } from "@/actions/busineses";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";

export default async function BusinessVenturesPage({ params, searchParams }: { params: { id: string }, searchParams: { page: string | undefined, pageSize: string | undefined } }) {
	const businessId = parseInt(params.id)
	if (isNaN(businessId)) {
		throw new Error("Invalid business id")
	}

	const resp = await getBusinessVentures({
		businessId,
		pagination: {
			page: searchParams.page ? parseInt(searchParams.page) : 1,
			pageSize: searchParams.pageSize ? parseInt(searchParams.pageSize) : 10,
		},
	})

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const ventures = resp?.data?.ventures || []

	return (
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">My Ventures</h1>
				<Link
					href={redirects.app.myBusinesses.view.ventures.create.replace(":id", businessId.toString())}
					className={buttonVariants()}
				>
					<Icons.add className="size-4 mr-2" />
					Create
				</Link>
			</div>
			<BusinessesVenturesTable columns={columns} data={ventures} id={businessId} />
		</div>
	);
}
