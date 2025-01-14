"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	createInvestmentPaymentIntent as createInvestmentPaymentIntentApi,
	getAccountInvestmentsByPage as getAccountInvestmentsByPageApi,
	getInvestmentById as getInvestmentByIdApi,
	createRoundInvestment,
} from "@repo/sdk";
import { cache } from "react";
import { offsetPaginationSchema, pathIdSchema } from "./validations";
import { zCreateInvestmentParams } from "@repo/sdk/zod";

export const getAccountInvestmentsByPage = actionClientWithAccount
	.schema(offsetPaginationSchema)
	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		const resp = await getAccountInvestmentsByPageApi({
			client: axiosClient,
			query: parsedInput,
		});

		return resp.data;
	});

// export const withdrawInvestment = actionClientWithAccount
// 	.schema(intIdSchema.required())
// 	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
// 		await withdrawInvestmentApi({
// 			client: axiosClient,
// 			path: {
// 				id: parsedInput,
// 			},
// 			throwOnError: true,
// 		});
// 	});

// export const getInvestmentPaymentIntentClientSecret = actionClientWithAccount
// 	.schema(intIdSchema.required())
// 	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
// 		if (!account) {
// 			throw new Error("Account not found");
// 		}

// 		const resp = await getInvestmentPaymentIntentClientSecretApi({
// 			client: axiosClient,
// 			path: {
// 				id: parsedInput,
// 			},
// 			throwOnError: true,
// 		});

// 		return resp.data;
// 	});

export const getInvestmentById = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		console.log("getting investment", parsedInput);

		const resp = await getInvestmentByIdApi({
			client: axiosClient,
			path: {
				id: parsedInput,
			},
			throwOnError: true,
		});

		return resp.data;
	});

export const getInvestmentByIdCached = cache(getInvestmentById);

export const createInvestmentPaymentIntent = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await createInvestmentPaymentIntentApi({
			client: axiosClient,
			path: {
				id: parsedInput,
			},
		});

		return resp.data;
	});

/**
 * Create an investment for a round
 */
export const createInvestmentAction = actionClientWithAccount
	.schema(zCreateInvestmentParams)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await createRoundInvestment({
			client: axiosClient,
			body: parsedInput,
			throwOnError: true,
		});

		return {
			id: resp.data.id,
		};
	});

// export const processInvestment = actionClientWithAccount
// 	.schema(intIdSchema.required())
// 	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
// 		await processInvestmentApi({
// 			client: axiosClient,
// 			path: {
// 				id: parsedInput,
// 			},
// 			throwOnError: true,
// 		});
// 	});
