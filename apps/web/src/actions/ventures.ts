"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createVenture as createVentureApi,
	getVentureById as getVentureByIdApi,
	getVentureFixedTotalRoundsCursor as getVentureFixedTotalRoundsCursorApi,
	getVenturePartialTotalRoundsCursor as getVenturePartialTotalRoundsCursorApi,
	getVentureRegularDynamicRoundsCursor as getVentureRegularDynamicRoundsCursorApi,
	getVentureDutchDynamicRoundsCursor as getVentureDutchDynamicRoundsCursorApi,
	getVentureRoundInvestmentsCursor as getVentureRoundInvestmentsCursorApi,
	updateVenture as updateVentureApi,
} from "@/lib/api";
import {
	intIdSchema,
	getByParentIdWithCursorSchema,
} from "@/actions/validations/shared";
import {
	createVentureSchema,
	updateVentureSchema,
} from "@/actions/validations/ventures";

/**
 * Create a venture
 */
export const createVenture = actionClient
	.schema(createVentureSchema)
	.action(
		async ({
			parsedInput: { address, venture },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("User not found");
			}

			await createVentureApi({
				client: apiClient,
				throwOnError: true,
				body: {
					address,
					venture: {
						...venture,
						isHidden: false,
					},
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

export const updateVenture = actionClient
	.schema(updateVentureSchema)
	.action(async ({ ctx: { apiClient }, parsedInput: { id, ...params } }) => {
		await updateVentureApi({
			client: apiClient,
			throwOnError: true,
			body: params,
			path: {
				id,
			},
		});
	});
