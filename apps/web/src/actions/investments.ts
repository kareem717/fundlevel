"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	createInvestmentPaymentIntent as createInvestmentPaymentIntentApi,
	getAccountInvestmentsByPage as getAccountInvestmentsByPageApi,
	// withdrawInvestment as withdrawInvestmentApi,
	getInvestmentById as getInvestmentByIdApi,
	// processInvestment as processInvestmentApi,
} from "@repo/sdk";
// import { createInvestmentSchema } from "@/actions/validations/investments";
import { intIdSchema, offsetPaginationSchema } from "./validations/shared";
import { cache } from "react";

/**
//  * Create a investment on a round
//  */
// export const createInvestment = actionClientWithAccount
// 	.schema(createInvestmentSchema)
// 	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
// 		if (!account) {
// 			throw new Error("Account not found");
// 		}

// 		const resp = await createRoundInvestmentApi({
// 			client: axiosClient,
// 			throwOnError: true,
// 			body: {
// 				...parsedInput,
// 				investorId: account.id,
// 			},
// 		});

// 		return resp.data.clientSecret;
// 	});

export const getAccountInvestmentsByPage = actionClientWithAccount
	.schema(offsetPaginationSchema)
	.action(async ({ parsedInput, ctx: { axiosClient, account } }) => {
		if (!account) {
			throw new Error("Account not found");
		}

		const resp = await getAccountInvestmentsByPageApi({
			client: axiosClient,
			path: {
				id: account.id,
			},
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
	.schema(intIdSchema.required())
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
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await createInvestmentPaymentIntentApi({
			client: axiosClient,
			path: {
				id: parsedInput,
			},
		});

		return resp.data;
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
