"use client";

import type { Receipt } from "@fundlevel/db/types";
import { Badge } from "@fundlevel/ui/components/badge";
import { Button } from "@fundlevel/ui/components/button";
import { Card } from "@fundlevel/ui/components/card";
import { Separator } from "@fundlevel/ui/components/separator";
import { AnimatePresence, motion } from "framer-motion";
import {
	Calendar,
	ChevronDown,
	Download,
	FileText,
	Loader2,
	Receipt as ReceiptIcon,
	Trash2,
} from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useReceiptItems } from "@/hooks/use-receipts-complete";

interface ReceiptItemCardProps extends ComponentPropsWithoutRef<"div"> {
	receipt: Receipt;
	isExpanded?: boolean;
	isExtracting?: boolean;
	isExporting?: boolean;
	onToggleExpansion?: (receiptId: number) => void;
	onExtract?: (receiptId: number) => void;
	onExportCSV?: (receiptId: number) => void;
	onDelete?: (receiptId: number) => void;
}

export function ReceiptItemCard({
	receipt,
	isExpanded = false,
	isExtracting = false,
	isExporting = false,
	onToggleExpansion,
	onExtract,
	onExportCSV,
	onDelete,
	className,
	...props
}: ReceiptItemCardProps) {
	// Get receipt items when expanded
	const { items, loading: itemsLoading } = useReceiptItems(receipt.id);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400";
			case "processing":
				return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "failed":
				return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400";
			case "pending":
				return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const formatDate = (date: Date | string | null) => {
		if (!date) return "";
		const dateObj = typeof date === "string" ? new Date(date) : date;
		return dateObj.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatCurrency = (amountCents: number | null) => {
		if (!amountCents) return "";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amountCents / 100);
	};

	const formatFileSize = (sizeStr: string) => {
		const size = Number.parseInt(sizeStr);
		if (size === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(size) / Math.log(k));
		return `${Number.parseFloat((size / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<Card
			className={`w-full border-border bg-background shadow-sm transition-shadow duration-200 hover:shadow-md ${className}`}
			{...props}
		>
			<div className="p-6">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<ReceiptIcon className="h-5 w-5 text-primary" />
						</div>
						<div>
							<h3 className="font-semibold text-foreground text-lg">
								{receipt.merchantName || receipt.originalFileName}
							</h3>
							<div className="mt-1 flex items-center space-x-4">
								{receipt.receiptDate && (
									<div className="flex items-center text-muted-foreground text-sm">
										<Calendar className="mr-1 h-4 w-4" />
										{formatDate(receipt.receiptDate)}
									</div>
								)}
								<div className="flex items-center text-muted-foreground text-sm">
									<ReceiptIcon className="mr-1 h-4 w-4" />
									{formatFileSize(receipt.fileSize)}
								</div>
							</div>
						</div>
					</div>
					<Badge className={getStatusColor(receipt.processingStatus)}>
						{isExtracting
							? "Extracting..."
							: receipt.processingStatus.charAt(0).toUpperCase() +
								receipt.processingStatus.slice(1)}
					</Badge>
				</div>

				{/* Amount and Currency */}
				{receipt.totalAmountCents && (
					<div className="mb-4 flex items-center justify-between">
						<div className="font-bold text-2xl text-foreground">
							{formatCurrency(receipt.totalAmountCents)}
						</div>
						{receipt.currency && receipt.currency !== "USD" && (
							<div className="text-muted-foreground text-sm">
								{receipt.currency}
							</div>
						)}
					</div>
				)}

				{/* Tax Amount */}
				{receipt.taxAmountCents && (
					<div className="mb-4 flex items-center text-muted-foreground text-sm">
						<span>Tax: {formatCurrency(receipt.taxAmountCents)}</span>
					</div>
				)}

				<Separator className="my-4" />

				{/* Action Buttons */}
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onToggleExpansion?.(receipt.id)}
						className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
						disabled={receipt.processingStatus !== "completed"}
					>
						<span>
							{isExpanded ? "Hide" : "Show"} Items
							{receipt.processingStatus === "completed" &&
								items.length > 0 &&
								` (${items.length})`}
						</span>
						<motion.div
							animate={{ rotate: isExpanded ? 180 : 0 }}
							transition={{ duration: 0.2 }}
						>
							<ChevronDown className="h-4 w-4" />
						</motion.div>
					</Button>

					<div className="flex items-center space-x-2">
						{receipt.processingStatus === "pending" && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onExtract?.(receipt.id)}
								disabled={isExtracting}
								className="flex items-center space-x-2"
							>
								{isExtracting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<FileText className="h-4 w-4" />
								)}
								<span>{isExtracting ? "Extracting..." : "Extract"}</span>
							</Button>
						)}

						{receipt.processingStatus === "completed" && items.length > 0 && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => onExportCSV?.(receipt.id)}
								disabled={isExporting}
								className="flex items-center space-x-2"
							>
								{isExporting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Download className="h-4 w-4" />
								)}
								<span>{isExporting ? "Exporting..." : "CSV"}</span>
							</Button>
						)}

						<Button
							variant="outline"
							size="sm"
							onClick={() => onDelete?.(receipt.id)}
							className="flex items-center space-x-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
						>
							<Trash2 className="h-4 w-4" />
							<span>Delete</span>
						</Button>
					</div>
				</div>

				{/* Expandable Items List */}
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="overflow-hidden"
						>
							<Separator className="my-4" />
							<div className="space-y-3">
								<h4 className="mb-3 font-medium text-foreground">
									Receipt Items
								</h4>
								{itemsLoading ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin" />
										<span className="ml-2 text-muted-foreground">
											Loading items...
										</span>
									</div>
								) : items.length === 0 ? (
									<div className="py-8 text-center text-muted-foreground">
										<ReceiptIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
										<p>No items extracted yet</p>
										<p className="mt-1 text-xs">
											Try extracting items using the Extract button
										</p>
									</div>
								) : (
									<div className="max-h-64 space-y-2 overflow-y-auto">
										{items.map((item, index) => (
											<motion.div
												key={item.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: index * 0.05, duration: 0.2 }}
												className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
											>
												<div className="flex-1">
													<div className="flex items-center justify-between">
														<span className="font-medium text-foreground">
															{item.name}
														</span>
														<span className="font-semibold text-foreground">
															{formatCurrency(item.totalPriceCents)}
														</span>
													</div>
													<div className="mt-1 flex items-center justify-between">
														<span className="text-muted-foreground text-sm">
															Qty: {item.quantity} ×{" "}
															{formatCurrency(item.unitPriceCents)}
														</span>
														{item.category && (
															<Badge variant="secondary" className="text-xs">
																{item.category}
															</Badge>
														)}
													</div>
												</div>
											</motion.div>
										))}
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</Card>
	);
}
