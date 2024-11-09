import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Investments",
};

export default function InvestmentsPage() {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Investments</h1>
		</div>
	);
}
