"use client";

import { Receipt, RefreshCw } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { UploadSection } from "@/components/upload-section";
import { useReceiptStats } from "@/hooks/use-receipt-stats";
import { useReceiptsComplete } from "@/hooks/use-receipts-complete";
import { ReceiptItemCard } from "./receipt-item";

interface ReceiptsClientProps extends ComponentPropsWithoutRef<"div"> {}

export function ReceiptsClient({ className, ...props }: ReceiptsClientProps) {
	// Get all state and actions from the complete hook
	const {
		// Data from React Query
		receipts,
		loading,
		error,

		// UI state from Zustand
		files,
		expandedReceipts,
		extractingReceipts,
		exportingReceipts,

		// Actions that integrate React Query + Zustand
		handleFiles,
		extractItems,
		toggleReceiptExpansion,
		exportReceiptCsv,
		deleteReceipt,
	} = useReceiptsComplete();

	// Get file statistics
	const { uploadingCount } = useReceiptStats(files);

	// Handle error state
	if (error) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
					<p className="text-destructive text-sm">
						Failed to load receipts:{" "}
						{error instanceof Error ? error.message : "Unknown error"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={className} {...props}>
			{/* Header */}
			<div className="border-b">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div>
							<h1 className="flex items-center gap-2 font-bold text-2xl">
								<Receipt className="h-6 w-6" />
								Receipts
							</h1>
							<p className="text-muted-foreground text-sm">
								Upload and manage your receipt documents
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<span className="text-muted-foreground text-sm">
									{receipts.length} receipts
								</span>
								{uploadingCount > 0 && (
									<span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs dark:bg-blue-900/20 dark:text-blue-400">
										<RefreshCw className="mr-1 h-3 w-3 animate-spin" />
										{uploadingCount} processing
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Enhanced Upload Section */}
				<div className="mb-8">
					<UploadSection
						onFilesSelected={handleFiles}
						maxFiles={10}
						maxSize={10 * 1024 * 1024} // 10MB
						acceptedTypes={["image/*", "application/pdf"]}
					/>
				</div>

				{/* Receipts List */}
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-xl">
							Your Receipts ({receipts.length})
						</h2>
						{loading && (
							<RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
						)}
					</div>

					{loading ? (
						<div className="flex items-center justify-center py-12">
							<RefreshCw className="mr-3 h-8 w-8 animate-spin text-muted-foreground" />
							<p className="text-muted-foreground">Loading receipts...</p>
						</div>
					) : receipts.length === 0 ? (
						<div className="py-12 text-center">
							<Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">No receipts yet</h3>
							<p className="text-muted-foreground">
								Upload your first receipt to get started with automatic item
								extraction
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{receipts.map((receipt) => (
								<ReceiptItemCard
									key={receipt.id}
									receipt={receipt}
									isExpanded={expandedReceipts.has(receipt.id)}
									isExtracting={extractingReceipts.has(receipt.id)}
									isExporting={exportingReceipts.has(receipt.id)}
									onToggleExpansion={toggleReceiptExpansion}
									onExtract={extractItems}
									onExportCSV={exportReceiptCsv}
									onDelete={deleteReceipt}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
