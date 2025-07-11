"use client";

import { RefreshCw } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { UploadSection } from "@/components/upload-section";
import { useBankStatementsComplete } from "@/hooks/use-bank-statements-complete";
import { useFileStats } from "@/hooks/use-file-stats";
import { BankStatementsList } from "./bank-statements-list";
import { RecentUploadsList } from "./recent-uploads-list";

interface BankStatementsClientProps extends ComponentPropsWithoutRef<"div"> {}

export function BankStatementsClient({
	className,
	...props
}: BankStatementsClientProps) {
	// Get all state and actions from the complete hook
	const {
		// Data from React Query
		bankStatements,
		loading,
		error,

		// UI state from Zustand
		files,
		expandedStatements,
		extractingStatements,
		exportingStatements,
		viewMode,

		// Actions that integrate React Query + Zustand
		handleFiles,
		removeFile,
		setViewMode,
		extractTransactions,
		toggleStatementExpansion,
		exportTransactionsCsv,
		deleteBankStatement,
	} = useBankStatementsComplete();

	// Get file statistics
	const { completedCount, uploadingCount } = useFileStats(files);

	// Handle error state
	if (error) {
		return (
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
					<p className="text-destructive text-sm">
						Failed to load bank statements:{" "}
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
							<h1 className="font-bold text-2xl">Bank Statements</h1>
							<p className="text-muted-foreground text-sm">
								Upload and manage your bank statement documents
							</p>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<span className="text-muted-foreground text-sm">
									{completedCount} files uploaded
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
				{/* Upload Section */}
				<UploadSection onFilesSelected={handleFiles} />

				{/* Recent Uploads */}
				<RecentUploadsList
					files={files}
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					onRemoveFile={removeFile}
				/>

				{/* Bank Statements List */}
				<BankStatementsList
					bankStatements={bankStatements}
					expandedStatements={expandedStatements}
					extractingStatements={extractingStatements}
					exportingStatements={exportingStatements}
					loading={loading}
					onExtractTransactions={extractTransactions}
					onToggleExpansion={toggleStatementExpansion}
					onExportCsv={exportTransactionsCsv}
					onDeleteStatement={deleteBankStatement}
				/>
			</div>
		</div>
	);
}
