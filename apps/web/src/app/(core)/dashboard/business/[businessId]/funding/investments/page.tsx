import { Metadata } from "next";
// import { RecievedInvestmentsTable } from "./components/recieved-investments-table";

export const metadata: Metadata = {
	title: "Offers",
};

export default function InvestmentsOffersPage() {
	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Investments Offers</h1>
			{/* <RecievedInvestmentsTable className="w-full" /> */}
		</div>
	);
}
