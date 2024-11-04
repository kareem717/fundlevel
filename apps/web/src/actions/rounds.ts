"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	getRoundById as getRoundByIdApi,
	createRound as createRoundApi,
	getRoundByCursor,
	getRoundsByPage as getRoundsByPageApi,
	createRoundFavourite,
	getRoundFavouriteStatus,
	deleteRoundFavourite,
} from "@/lib/api";
import {
	cursorPaginationSchema,
	intIdSchema,
} from "@/actions/validations/shared";
import { createRoundSchema } from "./validations/rounds";

/**
 * Create a venture
 */
export const createRound = actionClientWithAccount
	.schema(createRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		await createRoundApi({
			client: apiClient,
			throwOnError: true,
			body: {
				...parsedInput,
			},
		});
	});

/**
 * Create a venture
 */
export const getRoundById = actionClient
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const response = await getRoundByIdApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
			},
		});

		return response.data;
	});

/**
 * Get rounds by cursor pagination
 */
export const getRoundsInfinite = actionClient
	.schema(cursorPaginationSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const response = await getRoundByCursor({
			client: apiClient,
			throwOnError: true,
			query: parsedInput,
		});

		return response.data;
	});

/**
 * Get rounds by offset pagination
 */
export const getRoundsByPage = actionClient
	.schema(intIdSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		if (!parsedInput) {
			throw new Error("Round ID not found");
		}

		const response = await getRoundsByPageApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
			},
		});

		return response.data.rounds;
	});

export const isRoundLiked = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		const response = await getRoundFavouriteStatus({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});

		return response.data;
	});

export const likeRound = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createRoundFavourite({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});

export const unlikeRound = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await deleteRoundFavourite({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});
