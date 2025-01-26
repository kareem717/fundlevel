"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	getRoundById,
	createRound as createRoundApi,
	getRoundByCursor,
	getRoundsByPage as getRoundsByPageApi,
	getRoundTerms,
} from "@repo/sdk";
import { cache } from "react";
import { zCreateRoundParams } from "@repo/sdk/zod";
import {
	cursorPaginationSchema,
	offsetPaginationSchema,
	pathIdSchema,
} from "./validations";

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
 * Gets public round information by id
 */
export const getPublicRoundAction = cache(
	actionClient
		.schema(pathIdSchema)
		.action(async ({ parsedInput, ctx: { axiosClient } }) => {
			const response = await getRoundById({
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

export const getRoundTermsAction = cache(
	actionClient
		.schema(pathIdSchema)
		.action(async ({ parsedInput, ctx: { axiosClient } }) => {
			const response = await getRoundTerms({
				client: axiosClient,
				throwOnError: true,
				path: {
					id: parsedInput,
				},
			});

			return response.data;
		})
);
