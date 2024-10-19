import { getAccountBusinesses } from "@/actions/busineses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessesTable } from "./components/businesses-table";
import { columns } from "./components/businesses-table/columns";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";

export const dynamic = 'force-dynamic'

export default async function MyBusinessesPage() {
	const resp = await getAccountBusinesses()

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const businesses = resp?.data?.businesses || []

	return (
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">My Businesses</h1>
				<Link
					href={redirects.app.myBusinesses.create}
					className={buttonVariants()}
				>
					<Icons.add className="size-4 mr-2" />
					Create
				</Link>
			</div>
			<BusinessesTable columns={columns} data={businesses} />
		</div>
	);
}
