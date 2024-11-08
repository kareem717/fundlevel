"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	createRoundInvestment as createRoundInvestmentApi,
	getInvestmentPaymentIntentClientSecret as getInvestmentPaymentIntentClientSecretApi,
	getAccountInvestmentsByPage as getAccountInvestmentsByPageApi,
	withdrawInvestment as withdrawInvestmentApi,
	getInvestmentById as getInvestmentByIdApi,
} from "@/lib/api";
import { createInvestmentSchema } from "@/actions/validations/investments";
import { intIdSchema, offsetPaginationSchema } from "./validations/shared";
import { cache } from "react";

/**
 * Create a investment on a round
 */
export const createInvestment = actionClientWithAccount
	.schema(createInvestmentSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		await createRoundInvestmentApi({
			client: apiClient,
			path: {
				id: account.id,
			},
			throwOnError: true,
			body: {
				...parsedInput,
				investorId: account.id,
			},
		});
	});

export const getAccountInvestmentsByPage = actionClientWithAccount
	.schema(offsetPaginationSchema)
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		const resp = await getAccountInvestmentsByPageApi({
			client: apiClient,
			path: {
				id: account.id,
			},
			query: parsedInput,
		});

		return resp.data;
	});

export const withdrawInvestment = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		await withdrawInvestmentApi({
			client: apiClient,
			path: {
				id: account.id,
				investmentId: parsedInput,
			},
			throwOnError: true,
		});
	});

export const getInvestmentPaymentIntentClientSecret = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
			}

			const resp = await getInvestmentPaymentIntentClientSecretApi({
				client: apiClient,
				path: {
					id: account.id,
					investmentId: parsedInput,
				},
				throwOnError: true,
			});

			return resp.data;
		}
	);

export const getInvestmentById = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const resp = await getInvestmentByIdApi({
			client: apiClient,
			path: {
				id: parsedInput,
			},
			throwOnError: true,
		});

		return resp.data;
	});

export const getInvestmentByIdCached = cache(getInvestmentById);
