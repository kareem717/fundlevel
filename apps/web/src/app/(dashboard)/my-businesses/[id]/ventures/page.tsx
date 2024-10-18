import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { BusinessVenturesTable } from "./components/business-ventures-table";
import { Icons } from "@/components/ui/icons";
import redirects from "@/lib/config/redirects";

export default async function BusinessVenturesPage({ params }: { params: { id: string } }) {
	const businessId = parseInt(params.id)
	if (isNaN(businessId)) {
		throw new Error("Invalid business id")
	}

	return (
		<div className="pt-4 sm:pt-6 md:pt-20 px-2 max-w-screen-lg mx-auto space-y-4">
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
			<BusinessVenturesTable
				businessId={businessId}
			/>
		</div>
	);
}
