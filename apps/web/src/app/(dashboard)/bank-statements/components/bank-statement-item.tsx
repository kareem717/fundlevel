"use client";

import type { BankStatement } from "@fundlevel/db/types";
import { Button } from "@fundlevel/ui/components/button";
import {
	ChevronDown,
	ChevronRight,
	Clock,
	FileDown,
	FileText,
	Image,
	Play,
	RefreshCw,
	Trash2,
} from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useStatementTransactions } from "@/hooks/use-bank-statements-complete";
import { TransactionList } from "./transaction-list";

interface BankStatementItemProps extends ComponentPropsWithoutRef<"div"> {
	statement: BankStatement;
	isExpanded: boolean;
	isExtracting: boolean;
	isExporting: boolean;
	onExtract: (id: number) => void;
	onToggleExpansion: (id: number) => void;
	onExportCsv: (id: number) => void;
	onDelete: (id: number) => void;
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
	if (type.startsWith("image/")) return Image;
	if (type === "application/pdf") return FileText;
	return FileText;
};

export function BankStatementItem({
	className,
	statement,
	isExpanded,
	isExtracting,
	isExporting,
	onExtract,
	onToggleExpansion,
	onExportCsv,
	onDelete,
	...props
}: BankStatementItemProps) {
	const IconComponent = getFileIcon(statement.fileType);

	// Load transactions using React Query when expanded
	const { transactions, loading: transactionsLoading } =
		useStatementTransactions(statement.id);

	return (
		<div className={`transition-colors ${className || ""}`} {...props}>
			<div className="px-6 py-4 hover:bg-muted/50">
				<div className="flex items-center space-x-4">
					<div className="flex-shrink-0">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
							<IconComponent className="h-5 w-5 text-muted-foreground" />
						</div>
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center space-x-2">
							<p className="truncate font-medium text-sm">
								{statement.originalFileName}
							</p>
							<span
								className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
									statement.processingStatus === "completed"
										? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
										: statement.processingStatus === "processing"
											? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
											: statement.processingStatus === "failed"
												? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
												: "bg-muted text-muted-foreground"
								}`}
							>
								{isExtracting ? "extracting..." : statement.processingStatus}
							</span>
						</div>
						<div className="mt-1 flex items-center space-x-4">
							<p className="text-muted-foreground text-xs">
								{formatFileSize(Number.parseInt(statement.fileSize))}
							</p>
							<p className="flex items-center text-muted-foreground text-xs">
								<Clock className="mr-1 h-3 w-3" />
								{statement.createdAt.toLocaleString()}
							</p>
							{transactions.length > 0 && (
								<p className="text-muted-foreground text-xs">
									{transactions.length} transactions
								</p>
							)}
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{statement.processingStatus === "pending" && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => onExtract(statement.id)}
								disabled={isExtracting}
								className="text-xs"
							>
								{isExtracting ? (
									<RefreshCw className="mr-1 h-3 w-3 animate-spin" />
								) : (
									<Play className="mr-1 h-3 w-3" />
								)}
								Extract
							</Button>
						)}

						{statement.processingStatus === "completed" && (
							<>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => onToggleExpansion(statement.id)}
									className="text-xs"
								>
									{isExpanded ? (
										<ChevronDown className="mr-1 h-3 w-3" />
									) : (
										<ChevronRight className="mr-1 h-3 w-3" />
									)}
									{isExpanded ? "Hide" : "Show"} Transactions
								</Button>

								{transactions.length > 0 && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onExportCsv(statement.id)}
										disabled={isExporting}
										className="text-xs"
									>
										{isExporting ? (
											<RefreshCw className="mr-1 h-3 w-3 animate-spin" />
										) : (
											<FileDown className="mr-1 h-3 w-3" />
										)}
										Export CSV
									</Button>
								)}
							</>
						)}

						<Button
							onClick={() => onDelete(statement.id)}
							variant="ghost"
							size="icon"
							className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Transactions List */}
			{isExpanded &&
				(transactionsLoading ? (
					<div className="px-6 pb-4">
						<div className="rounded-lg bg-muted/30 p-4 text-center">
							<RefreshCw className="mx-auto mb-2 h-4 w-4 animate-spin" />
							<p className="text-muted-foreground text-sm">
								Loading transactions...
							</p>
						</div>
					</div>
				) : (
					<TransactionList
						transactions={transactions}
						statementId={statement.id}
					/>
				))}
		</div>
	);
}
