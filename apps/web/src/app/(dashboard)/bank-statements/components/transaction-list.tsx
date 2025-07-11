"use client";

import type { Transaction } from "@fundlevel/db/types";
import { DollarSign } from "lucide-react";
import React, { type ComponentPropsWithoutRef } from "react";

interface TransactionListProps extends ComponentPropsWithoutRef<"div"> {
	transactions: Transaction[];
	statementId: number;
}

const formatCurrency = (amountCents: number, currency = "USD"): string => {
	const amount = amountCents / 100;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount);
};

export function TransactionList({
	className,
	transactions,
	statementId,
	...props
}: TransactionListProps) {
	if (transactions.length === 0) {
		return null;
	}

	return (
		<div className={`px-6 pb-4 ${className || ""}`} {...props}>
			<div className="rounded-lg bg-muted/30 p-4">
				<h4 className="mb-3 flex items-center font-medium text-sm">
					<DollarSign className="mr-2 h-4 w-4" />
					Extracted Transactions ({transactions.length})
				</h4>
				<div className="max-h-64 space-y-2 overflow-y-auto">
					{transactions.map((transaction) => (
						<div
							key={transaction.id}
							className="flex items-center justify-between rounded border bg-background p-3 text-sm"
						>
							<div className="min-w-0 flex-1">
								<div className="flex items-center space-x-2">
									<p className="truncate font-medium">{transaction.merchant}</p>
									<span
										className={`rounded px-2 py-1 text-xs ${
											transaction.amountCents < 0
												? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
												: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
										}`}
									>
										{formatCurrency(
											transaction.amountCents,
											transaction.currency || "USD",
										)}
									</span>
								</div>
								<p className="truncate text-muted-foreground text-xs">
									{transaction.description}
								</p>
							</div>
							<p className="text-muted-foreground text-xs">
								{new Date(transaction.date).toLocaleDateString()}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
