"use client";

import { useCallback, useMemo } from "react";
import { useReceipts } from "./use-receipts";
import {
	useDeleteReceiptMutation,
	useExportReceiptCsvMutation,
	useExtractItemsMutation,
	useReceiptItemsQuery,
	useReceiptsQuery,
	useUploadReceiptMutation,
} from "./use-receipts-api";

/**
 * Complete hook that integrates React Query with Zustand UI state
 * Provides all functionality needed for receipts management
 */
export const useReceiptsComplete = () => {
	const uiState = useReceipts();

	// React Query hooks
	const receiptsQuery = useReceiptsQuery();
	const uploadMutation = useUploadReceiptMutation();
	const extractMutation = useExtractItemsMutation();
	const exportMutation = useExportReceiptCsvMutation();
	const deleteMutation = useDeleteReceiptMutation();

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

	// Enhanced extract items with UI state management
	const extractItems = useCallback(
		(receiptId: number) => {
			uiState.setExtracting(receiptId, true);

			extractMutation.mutate(receiptId, {
				onSuccess: () => {
					uiState.setExtracting(receiptId, false);
					uiState.toggleExpansion(receiptId);
				},
				onError: () => {
					uiState.setExtracting(receiptId, false);
				},
			});
		},
		[uiState, extractMutation],
	);

	// Enhanced export CSV with UI state management
	const exportReceiptCsv = useCallback(
		(receiptId: number) => {
			uiState.setExporting(receiptId, true);

			exportMutation.mutate(receiptId, {
				onSettled: () => {
					uiState.setExporting(receiptId, false);
				},
			});
		},
		[uiState, exportMutation],
	);

	// Enhanced delete with UI state cleanup
	const deleteReceipt = useCallback(
		(receiptId: number) => {
			deleteMutation.mutate(receiptId);
		},
		[deleteMutation],
	);

	// Enhanced toggle expansion
	const toggleReceiptExpansion = useCallback(
		(receiptId: number) => {
			uiState.toggleExpansion(receiptId);
		},
		[uiState],
	);

	// Memoized computed values
	const computedValues = useMemo(() => {
		const receipts = receiptsQuery.data || [];

		return {
			receipts,
			loading: receiptsQuery.isLoading,
			error: receiptsQuery.error,
		};
	}, [receiptsQuery]);

	return {
		// Data
		...computedValues,

		// UI State
		files: uiState.files,
		expandedReceipts: uiState.expandedReceipts,
		extractingReceipts: uiState.extractingReceipts,
		exportingReceipts: uiState.exportingReceipts,
		viewMode: uiState.viewMode,
		sortBy: uiState.sortBy,
		sortOrder: uiState.sortOrder,

		// Enhanced Actions
		handleFiles,
		removeFile: uiState.removeFile,
		setViewMode: uiState.setViewMode,
		extractItems,
		toggleReceiptExpansion,
		exportReceiptCsv,
		deleteReceipt,

		// Query controls
		refetchReceipts: receiptsQuery.refetch,

		// Loading states from mutations
		isUploading: uploadMutation.isPending,
		isExtracting: extractMutation.isPending,
		isExporting: exportMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};

/**
 * Hook to get items for a specific receipt with loading state
 */
export const useReceiptItems = (receiptId: number) => {
	const { expandedReceipts } = useReceipts();
	const isExpanded = expandedReceipts.has(receiptId);

	const itemsQuery = useReceiptItemsQuery(receiptId, isExpanded);

	return {
		items: itemsQuery.data || [],
		loading: itemsQuery.isLoading,
		error: itemsQuery.error,
		refetch: itemsQuery.refetch,
	};
};
