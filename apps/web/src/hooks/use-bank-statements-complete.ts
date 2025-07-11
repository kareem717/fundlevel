"use client";

import { useCallback, useMemo } from "react";
import { useBankStatements } from "./use-bank-statements";
import {
	useBankStatementsQuery,
	useDeleteBankStatementMutation,
	useExportCsvMutation,
	useExtractTransactionsMutation,
	useTransactionsQuery,
	useUploadBankStatementMutation,
} from "./use-bank-statements-api";

/**
 * Complete hook that integrates React Query with Zustand UI state
 * Provides all functionality needed for bank statements management
 */
export const useBankStatementsComplete = () => {
	const uiState = useBankStatements();

	// React Query hooks
	const bankStatementsQuery = useBankStatementsQuery();
	const uploadMutation = useUploadBankStatementMutation();
	const extractMutation = useExtractTransactionsMutation();
	const exportMutation = useExportCsvMutation();
	const deleteMutation = useDeleteBankStatementMutation();

	// Enhanced file upload that integrates with React Query
	const handleFiles = useCallback(
		(fileList: FileList) => {
			const newFiles = uiState.createFileUploadItems(fileList);
			uiState.addFiles(newFiles);

			// Upload each file
			newFiles.forEach((fileItem) => {
				const file = Array.from(fileList).find((f) => f.name === fileItem.name);
				if (file) {
					uploadMutation.mutate(file, {
						onSuccess: () => {
							uiState.updateFile(fileItem.id, {
								status: "completed",
								progress: 100,
								uploadedAt: new Date(),
							});
						},
						onError: (error) => {
							uiState.updateFile(fileItem.id, {
								status: "error",
								error: error instanceof Error ? error.message : "Upload failed",
							});
						},
					});
				}
			});
		},
		[uiState, uploadMutation],
	);

	// Enhanced extract transactions with UI state management
	const extractTransactions = useCallback(
		(statementId: number) => {
			uiState.setExtracting(statementId, true);

			extractMutation.mutate(statementId, {
				onSuccess: () => {
					uiState.setExtracting(statementId, false);
					uiState.toggleExpansion(statementId);
				},
				onError: () => {
					uiState.setExtracting(statementId, false);
				},
			});
		},
		[uiState, extractMutation],
	);

	// Enhanced export CSV with UI state management
	const exportTransactionsCsv = useCallback(
		(statementId: number) => {
			uiState.setExporting(statementId, true);

			exportMutation.mutate(statementId, {
				onSettled: () => {
					uiState.setExporting(statementId, false);
				},
			});
		},
		[uiState, exportMutation],
	);

	// Enhanced delete with UI state cleanup
	const deleteBankStatement = useCallback(
		(statementId: number) => {
			deleteMutation.mutate(statementId);
		},
		[deleteMutation],
	);

	// Enhanced toggle expansion with transaction loading
	const toggleStatementExpansion = useCallback(
		(statementId: number) => {
			uiState.toggleExpansion(statementId);
		},
		[uiState],
	);

	// Memoized computed values
	const computedValues = useMemo(() => {
		const bankStatements = bankStatementsQuery.data || [];

		return {
			bankStatements,
			loading: bankStatementsQuery.isLoading,
			error: bankStatementsQuery.error,

			// Transaction data for expanded statements
			transactions: Object.fromEntries(
				Array.from(uiState.expandedStatements).map((id) => [
					id,
					[], // Will be populated by individual transaction queries
				]),
			),
		};
	}, [bankStatementsQuery, uiState.expandedStatements]);

	return {
		// Data
		...computedValues,

		// UI State
		files: uiState.files,
		expandedStatements: uiState.expandedStatements,
		extractingStatements: uiState.extractingStatements,
		exportingStatements: uiState.exportingStatements,
		viewMode: uiState.viewMode,
		sortBy: uiState.sortBy,
		sortOrder: uiState.sortOrder,

		// Enhanced Actions
		handleFiles,
		removeFile: uiState.removeFile,
		setViewMode: uiState.setViewMode,
		extractTransactions,
		toggleStatementExpansion,
		exportTransactionsCsv,
		deleteBankStatement,

		// Query controls
		refetchBankStatements: bankStatementsQuery.refetch,

		// Loading states from mutations
		isUploading: uploadMutation.isPending,
		isExtracting: extractMutation.isPending,
		isExporting: exportMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};

/**
 * Hook to get transactions for a specific statement with loading state
 */
export const useStatementTransactions = (statementId: number) => {
	const { expandedStatements } = useBankStatements();
	const isExpanded = expandedStatements.has(statementId);

	const transactionsQuery = useTransactionsQuery(statementId, isExpanded);

	return {
		transactions: transactionsQuery.data || [],
		loading: transactionsQuery.isLoading,
		error: transactionsQuery.error,
		refetch: transactionsQuery.refetch,
	};
};
