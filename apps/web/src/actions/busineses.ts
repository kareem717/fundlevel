"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createVenture as createVentureApi,
	getAccountVentures as getAccountVenturesApi,
	createBu
} from "@/lib/api";
import {
	intIdSchema,
	paginationRequestSchema,
	getByParentIdWithCursorSchema,
} from "@/lib/validations/shared";
import { createVentureSchema } from "@/lib/validations/ventures";

/**
 * Get all ventures
 */
export const getAccountVentures = actionClient
	.schema(paginationRequestSchema)
	.action(
		async ({ parsedInput: { cursor, limit }, ctx: { apiClient, account } }) => {
			if (!account) {
				throw new Error("Account not found");
			}

			const data = await getAccountVenturesApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: account.id,
				},
				query: {
					cursor,
					limit,
				},
			});

			return data.data;
		}
	);

/**
 * Create a venture
 */
export const createVenture = actionClient
	.schema(createVentureSchema)
	.action(
		async ({
			parsedInput: { name, description },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("User not found");
			}

			await createVentureApi({
				client: apiClient,
				throwOnError: true,
				body: {
					name,
					description,
					ownerAccountId: account.id,
				},
			});
		}
	);

export const getVentureById = actionClient
	.schema(intIdSchema.required())
	.action(async ({ ctx: { apiClient }, parsedInput: id }) => {
		return await getVentureByIdApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id,
			},
		});
	});

export const getVentureFixedTotalRoundsCursor = actionClient
	.schema(getByParentIdWithCursorSchema)
	.action(
		async ({
			ctx: { apiClient },
			parsedInput: {
				parentId,
				cursorPaginationSchema: { cursor, limit },
			},
		}) => {
			const response = await getVentureFixedTotalRoundsCursorApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: parentId,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});

			return response.data;
		}
	);

export const getVenturePartialTotalRoundsCursor = actionClient
	.schema(getByParentIdWithCursorSchema)
	.action(
		async ({
			ctx: { apiClient },
			parsedInput: {
				parentId,
				cursorPaginationSchema: { cursor, limit },
			},
		}) => {
			const response = await getVenturePartialTotalRoundsCursorApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: parentId,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});

			return response.data;
		}
	);

export const getVentureRegularDynamicRoundsCursor = actionClient
	.schema(getByParentIdWithCursorSchema)
	.action(
		async ({
			ctx: { apiClient },
			parsedInput: {
				parentId,
				cursorPaginationSchema: { cursor, limit },
			},
		}) => {
			const response = await getVentureRegularDynamicRoundsCursorApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: parentId,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});

			return response.data;
		}
	);

export const getVentureDutchDynamicRoundsCursor = actionClient
	.schema(getByParentIdWithCursorSchema)
	.action(
		async ({
			ctx: { apiClient },
			parsedInput: {
				parentId,
				cursorPaginationSchema: { cursor, limit },
			},
		}) => {
			const response = await getVentureDutchDynamicRoundsCursorApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: parentId,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});

			return response.data;
		}
	);

export const getVentureRoundInvestmentsCursor = actionClient
	.schema(getByParentIdWithCursorSchema)
	.action(
		async ({
			ctx: { apiClient },
			parsedInput: {
				parentId,
				cursorPaginationSchema: { cursor, limit },
			},
		}) => {
			const response = await getVentureRoundInvestmentsCursorApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: parentId,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});

			return response.data;
		}
	);
