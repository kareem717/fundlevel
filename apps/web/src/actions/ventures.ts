"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	createVenture as createVentureApi,
	getVentureById as getVentureByIdApi,
	updateVenture as updateVentureApi,
	getVenturesByCursor,
	getVentureLikeStatus,
	createVentureLike,
	getVentureActiveRound as getVentureActiveRoundApi,
	deleteVentureLike,
} from "@/lib/api";
import {
	cursorPaginationSchema,
	intIdSchema,
} from "@/actions/validations/shared";
import {
	createVentureSchema,
	updateVentureSchema,
} from "@/actions/validations/ventures";

/**
 * Create a venture
 */
export const createVenture = actionClientWithAccount
	.schema(createVentureSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		await createVentureApi({
			client: apiClient,
			throwOnError: true,
			body: {
				...parsedInput,
			},
		});
	});

/**
 * Get ventures by cursor pagination
 */
export const getVenturesInfinite = actionClient
	.schema(cursorPaginationSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		console.log(parsedInput)
		const response = await getVenturesByCursor({
			client: apiClient,
			throwOnError: true,
			query: parsedInput,
		});

		return response.data;
	});

/**
 * Get venture by id
 */
export const getVentureById = actionClient
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const response = await getVentureByIdApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
			},
		});

		return response.data;
	});

/**
 * Update a venture
 */
export const updateVenture = actionClientWithAccount
	.schema(updateVentureSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		await updateVentureApi({
			client: apiClient,
			throwOnError: true,
			body: parsedInput,
			path: {
				id: parsedInput.id,
			},
		});
	});

export const isVentureLiked = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		const response = await getVentureLikeStatus({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});

		return response.data;
	});

export const likeVenture = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createVentureLike({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});

export const unlikeVenture = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await deleteVentureLike({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});

export const getVentureActiveRound = actionClient
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const response = await getVentureActiveRoundApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
			},
		});

		return response.data;
	});
