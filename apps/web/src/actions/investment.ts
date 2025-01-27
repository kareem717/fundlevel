"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	createInvestmentPaymentIntent,
	getInvestmentById as getInvestmentByIdApi,
	createRoundInvestment,
} from "@repo/sdk";
import { cache } from "react";
import { pathIdSchema } from "./validations";
import { zCreateInvestmentParams } from "@repo/sdk/zod";

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

export const createInvestmentPaymentIntentAction = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await createInvestmentPaymentIntent({
			client: axiosClient,
			path: {
				id: parsedInput,
			},
		});

		return resp.data?.client_secret;
	});

export const createInvestmentAction = actionClientWithAccount
	.schema(zCreateInvestmentParams)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await createRoundInvestment({
			client: axiosClient,
			body: parsedInput,
			throwOnError: true,
		});

		return resp.data;
	});
