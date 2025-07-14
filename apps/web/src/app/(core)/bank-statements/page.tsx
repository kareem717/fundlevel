import type { Metadata } from "next";
import { BankStatementList } from "./components/bank-statement-list";
import { BankStatementUpload } from "./components/bank-statement-upload";

export const metadata: Metadata = {
	title: "Bank Statements",
	description: "Bank Statements",
};

export default function BankStatementsPage() {
	return (
		<div className="container mx-auto space-y-14 p-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="font-bold text-3xl text-foreground">Bank Statements</h1>
				<p className="text-muted-foreground">
					Upload and manage your bank statements
				</p>
			</div>
			<BankStatementUpload />
			<BankStatementList />
		</div>
	);
}
