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
} from "@repo/sdk";
import {
	cursorPaginationSchema,
} from "@/actions/validations/shared";
import { cache } from "react";
import { zCreateRoundParams } from "@repo/sdk/zod";
import { offsetPaginationSchema, pathIdSchema } from "./validations";

/**
 * Create a venture
 */
export const createRound = actionClientWithAccount
	.schema(zCreateRoundParams)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		await createRoundApi({
			client: axiosClient,
			throwOnError: true,
			body: parsedInput,
		});
	});

/**
 * Create a venture
 */
export const getRoundById = cache(
	actionClient
		.schema(pathIdSchema)
		.action(async ({ parsedInput, ctx: { axiosClient } }) => {
			const response = await getRoundByIdApi({
				client: axiosClient,
				throwOnError: true,
				path: {
					id: parsedInput,
				},
			});

			return response.data;
		})
);

/**
 * Get rounds by cursor pagination
 */
export const getRoundsInfinite = actionClient
	.schema(cursorPaginationSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const response = await getRoundByCursor({
			client: axiosClient,
			throwOnError: true,
			query: parsedInput,
		});

		return response.data;
	});

/**
 * Get rounds by offset pagination
 */
export const getRoundsByPage = actionClient
	.schema(offsetPaginationSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		if (!parsedInput) {
			throw new Error("Round ID not found");
		}

		const response = await getRoundsByPageApi({
			client: axiosClient,
			throwOnError: true,
			query: parsedInput,
		});

		return response.data.rounds;
	});

export const isRoundLiked = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		const response = await getRoundFavouriteStatus({
			client: axiosClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});

		return response.data;
	});

export const likeRound = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createRoundFavourite({
			client: axiosClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});

export const unlikeRound = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await deleteRoundFavourite({
			client: axiosClient,
			throwOnError: true,
			path: {
				id: parsedInput,
				accountId: account.id,
			},
		});
	});
