"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createFixedTotalRound as createFixedTotalRoundApi,
	createPartialTotalRound as createPartialTotalRoundApi,
	createRegularDynamicRound as createRegularDynamicRoundApi,
	createDutchDynamicRound as createDutchDynamicRoundApi,
	getFixedTotalRoundById as getFixedTotalRoundByIdApi,
} from "@/lib/api";
import { intIdSchema } from "@/lib/validations/shared";
import {
	createFixedTotalRoundSchema,
	createPartialTotalRoundSchema,
	createRegularDynamicRoundSchema,
	createDutchDynamicRoundSchema,
} from "@/lib/validations/rounds";

/**
 * Create a venture
 */
export const createFixedTotalRound = actionClient
	.schema(createFixedTotalRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createFixedTotalRoundApi({
			client: apiClient,
			throwOnError: true,
			body: parsedInput,
		});
	});

/**
 * Create a venture
 */
export const createPartialTotalRound = actionClient
	.schema(createPartialTotalRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createPartialTotalRoundApi({
			client: apiClient,
			throwOnError: true,
			body: parsedInput,
		});
	});
	
/**
 * Create a venture
 */
export const createRegularDynamicRound = actionClient
	.schema(createRegularDynamicRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createRegularDynamicRoundApi({
			client: apiClient,
			throwOnError: true,
			body: parsedInput,
		});
	});
/**
 * Create a venture
 */
export const createDutchDynamicRound = actionClient
	.schema(createDutchDynamicRoundSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		await createDutchDynamicRoundApi({
			client: apiClient,
			throwOnError: true,
			body: parsedInput,
		});
	});

/**
 * Create a venture
 */
export const getFixedTotalRoundById = actionClient
	.schema(intIdSchema)
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		if (!parsedInput) {
			throw new Error("Round ID not found");
		}

		const response = await getFixedTotalRoundByIdApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: parsedInput,
			},
		});

		return response.data.round;
	});
