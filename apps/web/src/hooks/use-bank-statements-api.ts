"use client";

import type { BankStatement, Transaction } from "@fundlevel/db/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookieHeaderFn } from "@/app/actions/utils";
import { useBindings } from "@/components/providers/bindings-provider";
import { apiClient } from "@/lib/api-client";

// Query Keys
export const bankStatementsKeys = {
	all: ["bank-statements"] as const,
	lists: () => [...bankStatementsKeys.all, "list"] as const,
	list: (filters: string) =>
		[...bankStatementsKeys.lists(), { filters }] as const,
	details: () => [...bankStatementsKeys.all, "detail"] as const,
	detail: (id: number) => [...bankStatementsKeys.details(), id] as const,
	transactions: (id: number) =>
		[...bankStatementsKeys.detail(id), "transactions"] as const,
};

// Fetch bank statements
export const useBankStatementsQuery = () => {
	const env = useBindings();

	return useQuery({
		queryKey: bankStatementsKeys.lists(),
		queryFn: async (): Promise<BankStatement[]> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"].$get({});

			if (!response.ok) {
				throw new Error("Failed to fetch bank statements");
			}

			const statements = (await response.json()) as any[];
			return statements.map((stmt: any) => ({
				...stmt,
				createdAt: new Date(stmt.createdAt),
				updatedAt: new Date(stmt.updatedAt),
				processingStatus:
					stmt.processingStatus as BankStatement["processingStatus"],
			}));
		},
	});
};

// Fetch transactions for a specific bank statement
export const useTransactionsQuery = (statementId: number, enabled = true) => {
	const env = useBindings();

	return useQuery({
		queryKey: bankStatementsKeys.transactions(statementId),
		queryFn: async (): Promise<Transaction[]> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"][":id"].transactions.$get(
				{
					param: { id: statementId.toString() },
				},
			);

			if (!response.ok) {
				throw new Error("Failed to load transactions");
			}

			const transactions = (await response.json()) as any[];
			return transactions.map((t: any) => ({
				...t,
				currency: t.currency || "USD",
			}));
		},
		enabled,
	});
};

// Upload bank statement mutation
export const useUploadBankStatementMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File): Promise<BankStatement> => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"].upload.$post({
				form: { file },
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const uploadedStatement = (await response.json()) as any;
			return {
				...uploadedStatement,
				createdAt: new Date(uploadedStatement.createdAt),
				updatedAt: new Date(uploadedStatement.updatedAt),
				processingStatus:
					uploadedStatement.processingStatus as BankStatement["processingStatus"],
			};
		},
		onSuccess: () => {
			// Invalidate and refetch bank statements
			queryClient.invalidateQueries({ queryKey: bankStatementsKeys.lists() });
		},
	});
};

// Extract transactions mutation
export const useExtractTransactionsMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (statementId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"][":id"].extract.$post({
				param: { id: statementId.toString() },
			});

			if (!response.ok) {
				throw new Error("Extraction failed");
			}

			return response.json();
		},
		onSuccess: (_, statementId) => {
			// Invalidate bank statements and transactions
			queryClient.invalidateQueries({ queryKey: bankStatementsKeys.lists() });
			queryClient.invalidateQueries({
				queryKey: bankStatementsKeys.transactions(statementId),
			});
		},
	});
};

// Export CSV mutation
export const useExportCsvMutation = () => {
	const env = useBindings();

	return useMutation({
		mutationFn: async (statementId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"][":id"][
				"export-csv"
			].$post({
				param: { id: statementId.toString() },
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

// Delete bank statement mutation
export const useDeleteBankStatementMutation = () => {
	const env = useBindings();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (statementId: number) => {
			const client = apiClient(
				env.NEXT_PUBLIC_SERVER_URL,
				await getCookieHeaderFn(),
			);
			const response = await client["bank-statements"][":id"].$delete({
				param: { id: statementId.toString() },
			});

			if (!response.ok) {
				throw new Error("Failed to delete bank statement");
			}

			return statementId;
		},
		onSuccess: () => {
			// Invalidate and refetch bank statements
			queryClient.invalidateQueries({ queryKey: bankStatementsKeys.lists() });
		},
	});
};
