import { getBusinessById } from "@/actions/busineses";
import { notFound } from "next/navigation";

export default async function BusinessPage({ params }: { params: { id: string } }) {
	const parsedId = parseInt(params.id);
	if (isNaN(parsedId)) {
		throw notFound();
	}

	const business = await getBusinessById(parsedId);
	if (!business) {
		throw notFound();
	}

	return (
		<div>
			Business:
			<br />
			{JSON.stringify(business.data?.business, null, 2)}
		</div>
	);
}
