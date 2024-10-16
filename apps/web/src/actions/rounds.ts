"use server";

import { actionClient } from "@/lib/safe-action";
import {
	getRoundById as getRoundByIdApi,
	createRound as createRoundApi,
	getRoundByCursor,
	getRoundsByPage as getRoundsByPageApi,
} from "@/lib/api";
import {
	cursorPaginationSchema,
	intIdSchema,
} from "@/actions/validations/shared";
import { createRoundSchema } from "./validations/rounds";

/**
 * Create a venture
 */
export const createRound = actionClient
	.schema(createRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

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
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

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
