"use client";

import { Badge } from "@fundlevel/ui/components/badge";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { cn } from "@fundlevel/ui/lib/utils";
import { EmptyListState } from "@fundlevel/web/components/empty-list-state";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { nanoid } from "nanoid";
import type { ComponentPropsWithoutRef } from "react";
import { BankStatementCard } from "./bank-statement-card";
import { BankStatementItem } from "./bank-statement-item";

interface BankStatementListProps extends ComponentPropsWithoutRef<"section"> {}

const DEFAULT_BANK_STATEMENTS = [
	{
		fileName: "Q4 2024.pdf",
		uploadDate: "2024-12-15",
		fileSize: "2.4 MB",
		fileType: "PDF",
		className:
			"[grid-area:stack] hover:-translate-y-12 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/40 grayscale-[60%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
	},
	{
		fileName: "Chequing.csv",
		uploadDate: "2024-11-30",
		fileSize: "1.8 MB",
		fileType: "CSV",
		className:
			"[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-2 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/40 grayscale-[60%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
	},
	{
		fileName: "Zero Interest Savings.pdf",
		uploadDate: "2025-10-31",
		fileSize: "856 KB",
		fileType: "PDF",
		className:
			"[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-12",
	},
] as const;

export function BankStatementList({
	className,
	...props
}: BankStatementListProps) {
	const { data, isPending, isError, refetch } = useQuery(
		orpc.bankStatement.list.queryOptions(),
	);

	if (isPending) {
		return (
			<section className={cn("space-y-6", className)} {...props}>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, _i) => (
						<Skeleton key={nanoid()} className="h-48 w-full" />
					))}
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className={cn("space-y-6", className)} {...props}>
				<div className="flex justify-center py-12">
					<EmptyListState
						title="Error Loading Bank Statements"
						description="There was an error loading your bank statements. Please try again."
						icons={[Settings]}
						action={{
							label: "Retry",
							onClick: () => refetch(),
						}}
					/>
				</div>
			</section>
		);
	}

	return (
		<section className={cn("space-y-20 pb-20", className)} {...props}>
			<div className="space-y-4">
				<div className="flex items-center justify-start gap-2">
					<Badge variant="secondary">
						{data.length > 99 ? "99+" : data.length}
					</Badge>
					<h2 className="flex-1 font-semibold text-foreground text-xl">
						Bank Statements
					</h2>
				</div>
				{data?.length > 0 ? (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{data.map((bankStatement) => (
							<BankStatementItem
								key={bankStatement.id}
								bankStatement={bankStatement}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-border border-dashed p-4">
						<h2 className="font-bold text-2xl">
							{" "}
							Extract transactions from your bank statements{" "}
						</h2>
						<p className="text-muted-foreground">
							Upload your bank statements to get started.
						</p>
						<div className="fade-in-0 -mt-20 grid min-h-[500px] animate-in place-items-center opacity-100 duration-700 [grid-template-areas:'stack']">
							{DEFAULT_BANK_STATEMENTS.map((statement, index) => (
								<BankStatementCard key={nanoid()} {...statement} />
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
