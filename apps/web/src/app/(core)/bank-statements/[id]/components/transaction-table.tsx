"use client";

import { Button } from "@fundlevel/ui/components/button";
import { Skeleton } from "@fundlevel/ui/components/skeleton";
import { cn } from "@fundlevel/ui/lib/utils";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { formatCurrency, formatDate } from "@fundlevel/web/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Calendar,
	Coins,
	DollarSign,
	FileDown,
	Info,
	Loader2,
	User,
} from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

interface TransactionTableProps extends ComponentPropsWithoutRef<"div"> {
	bankStatementId: number;
}

export function TransactionTable({
	bankStatementId,
	className,
	...props
}: TransactionTableProps) {
	const { data, isLoading } = useQuery(
		orpc.bankStatement.transactions.queryOptions({
			input: { params: { id: bankStatementId } },
		}),
	);

	const { mutateAsync: exportCsv, isPending: isExportingCsv } = useMutation(
		orpc.bankStatement.exportCsv.mutationOptions({
			onSuccess: (data) => {
				window.open(data.downloadUrl, "_blank");
			},
		}),
	);

	return (
		<div className={cn("w-full space-y-4", className)} {...props}>
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-foreground text-xl">Transactions</h2>
				<Button
					variant="outline"
					size="sm"
					className="flex items-center gap-2"
					onClick={() =>
						toast.promise(exportCsv({ params: { id: bankStatementId } }), {
							loading: "Exporting CSV...",
							success: "CSV export ready for download",
							error: "Failed to export CSV",
						})
					}
					disabled={isExportingCsv || !data || data.length === 0}
				>
					{isExportingCsv ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<FileDown className="h-4 w-4" />
					)}
					Export CSV
				</Button>
			</div>
			<div className="rounded-md border border-border bg-background">
				<table className="w-full">
					<thead>
						<tr className="border-b">
							<th className="h-12 w-[180px] px-4 text-left align-middle font-medium text-muted-foreground">
								Date
							</th>
							<th className="h-12 w-[40%] px-4 text-left align-middle font-medium text-muted-foreground">
								Description
							</th>
							<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
								Merchant
							</th>
							<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
								Currency
							</th>
							<th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
								Amount
							</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							// Loading skeleton rows
							Array.from({ length: 6 }, (_, index) => index).map((index) => (
								<tr key={`loading-skeleton-row-${index}`} className="border-b">
									<td className="p-4">
										<div className="flex items-center gap-2">
											<Skeleton className="h-8 w-8 rounded-full" />
											<Skeleton className="h-4 w-24" />
										</div>
									</td>
									<td className="p-4">
										<Skeleton className="h-4 w-full" />
									</td>
									<td className="p-4">
										<Skeleton className="h-4 w-24" />
									</td>
									<td className="p-4">
										<Skeleton className="h-4 w-16" />
									</td>
									<td className="p-4 text-right">
										<Skeleton className="ml-auto h-4 w-20" />
									</td>
								</tr>
							))
						) : data?.length === 0 ? (
							// Empty state
							<tr>
								<td colSpan={5} className="h-24 p-4 text-center">
									<div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
										<Info className="h-8 w-8" />
										<p>No transactions found</p>
									</div>
								</td>
							</tr>
						) : (
							// Actual data rows
							data?.map((transaction) => (
								<tr key={transaction.id} className="border-b hover:bg-muted/50">
									<td className="p-4">
										<div className="flex items-center gap-2">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
												<Calendar className="h-4 w-4" />
											</div>
											<span>{formatDate(transaction.date)}</span>
										</div>
									</td>
									<td className="p-4">
										<div className="font-medium">{transaction.description}</div>
									</td>
									<td className="p-4">
										{transaction.merchant ? (
											<div className="flex items-center gap-2">
												<User className="h-4 w-4 text-muted-foreground" />
												<span>{transaction.merchant}</span>
											</div>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
									<td className="p-4">
										{transaction.currency ? (
											<div className="flex items-center gap-2">
												<Coins className="h-4 w-4 text-muted-foreground" />
												<span className="font-mono text-sm uppercase">
													{transaction.currency}
												</span>
											</div>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
									<td className="p-4 text-right">
										<div
											className={cn(
												"font-medium",
												transaction.amountCents < 0
													? "text-destructive"
													: "text-green-600",
											)}
										>
											{formatCurrency(
												transaction.amountCents,
												transaction.currency || undefined,
											)}
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{!isLoading && data && data.length > 0 && (
				<div className="flex items-center justify-between px-2 text-muted-foreground text-sm">
					<div>
						<span>Total transactions: {data.length}</span>
					</div>
					<div className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						<span>
							Total:{" "}
							{formatCurrency(
								data.reduce(
									(sum, transaction) => sum + transaction.amountCents,
									0,
								),
								data[0]?.currency || undefined,
							)}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
