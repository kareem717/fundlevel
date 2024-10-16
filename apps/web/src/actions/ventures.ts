"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createVenture as createVentureApi,
	getVentureById as getVentureByIdApi,
	updateVenture as updateVentureApi,
	getVenturesByCursor,
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
export const createVenture = actionClient
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
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

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
export const updateVenture = actionClient
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
