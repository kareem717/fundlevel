import { getAccountBusinesses } from "@/actions/busineses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function BusinessPage() {
	const resp = await getAccountBusinesses()

	if (resp?.serverError || resp?.validationErrors) {
		console.error(resp)
		throw new Error(resp.serverError?.message || "Something went wrong")
	}

	const businesses = resp?.data?.businesses

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
			<div className="flex flex-col gap-4 max-w-sm">
				{businesses?.map((business) => (
					<Link
						href={`/my-businesses/${business.id}`}
						className={buttonVariants({ variant: "outline" })}
					>
						{business.name}
					</Link>
				))}
			</div>
		</div>
	);
}
