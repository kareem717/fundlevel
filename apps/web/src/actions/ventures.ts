"use server";

import { actionClient } from "@/lib/safe-action";
import {
	getAllVentures as getAllVenturesApi,
	createVenture as createVentureApi,
	getAccountVentures as getAccountVenturesApi,
	getVentureById as getVentureByIdApi,
	getVentureRounds as getVentureRoundsApi,
} from "@/lib/api";
import { intIdSchema, paginationRequestSchema } from "@/lib/validations/shared";
import { createVentureSchema } from "@/lib/validations/ventures";

/**
 * Get all ventures
 */
export const getAllVentures = actionClient
	.schema(paginationRequestSchema)
	.action(
		async ({ parsedInput: { cursor, limit }, ctx: { apiClient, user } }) => {
			if (!user) {
				throw new Error("User not found");
			}

			return await getAllVenturesApi({
				client: apiClient,
				throwOnError: true,
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});
		}
	);

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

			return await getAccountVenturesApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: account.id,
				},
				query: {
					cursor: cursor ?? undefined,
					limit: limit ?? undefined,
				},
			});
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

			return await createVentureApi({
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

export const getVentureRounds = actionClient
	.schema(intIdSchema.required())
	.action(async ({ ctx: { apiClient }, parsedInput: id }) => {
		return await getVentureRoundsApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id,
			},
		});
	});
