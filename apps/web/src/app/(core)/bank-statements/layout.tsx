import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		template: "%s | Bank Statements",
		default: "Bank Statements",
	},
	description: "Bank Statements",
};

export default async function BankStatementLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return children;
}
