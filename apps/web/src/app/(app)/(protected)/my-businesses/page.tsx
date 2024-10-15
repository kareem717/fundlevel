import { getAccountBusinesses } from "@/actions/busineses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessesTable } from "./components/businesses-table";
import { columns } from "./components/businesses-table/columns";

export default async function BusinessPage() {
	const resp = await getAccountBusinesses()

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const businesses = resp?.data?.businesses || []

	return (
		<div>
			<div className="flex justify-between items-center max-w-screen-lg mx-auto">
				<h1>My Businesses</h1>
				<Link
					href="/my-businesses/create"
					className={buttonVariants()}
				>
					Create Business
				</Link>
			</div>
			<div className="max-w-screen-lg mx-auto">
				<BusinessesTable columns={columns} data={businesses} />
			</div>
		</div>
	);
}
