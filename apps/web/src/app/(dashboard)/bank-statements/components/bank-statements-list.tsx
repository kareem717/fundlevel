"use client";

import type { BankStatement, Transaction } from "@fundlevel/db/types";
import { FileText } from "lucide-react";
import React, { type ComponentPropsWithoutRef } from "react";
import { BankStatementItem } from "./bank-statement-item";

interface BankStatementsListProps extends ComponentPropsWithoutRef<"div"> {
	bankStatements: BankStatement[];
	expandedStatements: Set<number>;
	extractingStatements: Set<number>;
	exportingStatements: Set<number>;
	loading: boolean;
	onExtractTransactions: (id: number) => void;
	onToggleExpansion: (id: number) => void;
	onExportCsv: (id: number) => void;
	onDeleteStatement: (id: number) => void;
}

export function BankStatementsList({
	className,
	bankStatements,
	expandedStatements,
	extractingStatements,
	exportingStatements,
	loading,
	onExtractTransactions,
	onToggleExpansion,
	onExportCsv,
	onDeleteStatement,
	...props
}: BankStatementsListProps) {
	if (loading) {
		return (
			<div
				className={`rounded-xl border bg-card p-8 text-center ${className || ""}`}
				{...props}
			>
				<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
				<p className="text-muted-foreground">Loading bank statements...</p>
			</div>
		);
	}

	if (bankStatements.length === 0) {
		return (
			<div
				className={`rounded-xl border bg-card p-8 text-center ${className || ""}`}
				{...props}
			>
				<FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">No bank statements yet</h3>
				<p className="text-muted-foreground">
					Upload your first bank statement to get started
				</p>
			</div>
		);
	}

	return (
		<div
			className={`overflow-hidden rounded-xl border bg-card ${className || ""}`}
			{...props}
		>
			<div className="border-b px-6 py-4">
				<h3 className="font-semibold text-lg">
					Bank Statements ({bankStatements.length})
				</h3>
			</div>
			<div className="divide-y">
				{bankStatements.map((statement) => (
					<BankStatementItem
						key={statement.id}
						statement={statement}
						isExpanded={expandedStatements.has(statement.id)}
						isExtracting={extractingStatements.has(statement.id)}
						isExporting={exportingStatements.has(statement.id)}
						onExtract={onExtractTransactions}
						onToggleExpansion={onToggleExpansion}
						onExportCsv={onExportCsv}
						onDelete={onDeleteStatement}
					/>
				))}
			</div>
		</div>
	);
}
