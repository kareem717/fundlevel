"use client";

import type { Receipt, ReceiptItem } from "@fundlevel/db/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookieHeaderFn } from "@/app/actions/utils";
import { useBindings } from "@/components/providers/bindings-provider";
import { apiClient } from "@/lib/api-client";

// Query Keys
export const receiptsKeys = {
	all: ["receipts"] as const,
	lists: () => [...receiptsKeys.all, "list"] as const,
	list: (filters: string) => [...receiptsKeys.lists(), { filters }] as const,
	details: () => [...receiptsKeys.all, "detail"] as const,
	detail: (id: number) => [...receiptsKeys.details(), id] as const,
	items: (id: number) => [...receiptsKeys.detail(id), "items"] as const,
};

// Fetch receipts
export const useReceiptsQuery = () => {
	const env = useBindings();

	return useQuery({
		queryKey: receiptsKeys.lists(),
		queryFn: async (): Promise<Receipt[]> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts.$get({});

			if (!response.ok) {
				throw new Error("Failed to fetch receipts");
			}

			const receipts = await response.json();
			return receipts.map((receipt) => ({
				...receipt,
				createdAt: new Date(receipt.createdAt),
				updatedAt: new Date(receipt.updatedAt),
				receiptDate: receipt.receiptDate
					? new Date(receipt.receiptDate).toISOString()
					: null,
				processingStatus:
					receipt.processingStatus as Receipt["processingStatus"],
			}));
		},
	});
};

// Fetch items for a specific receipt
export const useReceiptItemsQuery = (receiptId: number, enabled = true) => {
	const env = useBindings();

	return useQuery({
		queryKey: receiptsKeys.items(receiptId),
		queryFn: async (): Promise<ReceiptItem[]> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts[":id"].items.$get({
				param: { id: receiptId.toString() },
			});

			if (!response.ok) {
				throw new Error("Failed to load receipt items");
			}

			const items = await response.json();
			return items.map((item) => ({
				...item,
				createdAt: new Date(item.createdAt),
			}));
		},
		enabled,
	});
};

// Upload receipt mutation
export const useUploadReceiptMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File): Promise<Receipt> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts.upload.$post({
				form: { file },
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const uploadedReceipt = await response.json();
			return {
				...uploadedReceipt,
				createdAt: new Date(uploadedReceipt.createdAt),
				updatedAt: new Date(uploadedReceipt.updatedAt),
				receiptDate: uploadedReceipt.receiptDate
					? new Date(uploadedReceipt.receiptDate).toISOString()
					: null,
				processingStatus:
					uploadedReceipt.processingStatus as Receipt["processingStatus"],
			};
		},
		onSuccess: () => {
			// Invalidate and refetch receipts
			queryClient.invalidateQueries({ queryKey: receiptsKeys.lists() });
		},
	});
};

// Extract items mutation
export const useExtractItemsMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (receiptId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts[":id"].extract.$post({
				param: { id: receiptId.toString() },
			});

			if (!response.ok) {
				throw new Error("Extraction failed");
			}

			return response.json();
		},
		onSuccess: (_, receiptId) => {
			// Invalidate receipts and items
			queryClient.invalidateQueries({ queryKey: receiptsKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: receiptsKeys.items(receiptId),
			});
		},
	});
};

// Export CSV mutation
export const useExportReceiptCsvMutation = () => {
	const env = useBindings();

	return useMutation({
		mutationFn: async (receiptId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts[":id"]["export-csv"].$post({
				param: { id: receiptId.toString() },
			});

			if (!response.ok) {
				throw new Error("Export failed");
			}

			const result = (await response.json()) as {
				downloadUrl: string;
				fileName: string;
				expiresAt: string;
			};

			// Create a temporary link to download the file
			const link = document.createElement("a");
			link.href = result.downloadUrl;
			link.download = result.fileName;
			link.target = "_blank";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			return result;
		},
	});
};

// Delete receipt mutation
export const useDeleteReceiptMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (receiptId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client.receipts[":id"].$delete({
				param: { id: receiptId.toString() },
			});

			if (!response.ok) {
				throw new Error("Failed to delete receipt");
			}

			return receiptId;
		},
		onSuccess: () => {
			// Invalidate and refetch receipts
			queryClient.invalidateQueries({ queryKey: receiptsKeys.lists() });
		},
	});
};
