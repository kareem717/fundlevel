"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	getInvestmentById as getInvestmentByIdApi,
	createRoundInvestment,
	confirmInvestmentPayment,
} from "@repo/sdk";
import { cache } from "react";
import { pathIdSchema } from "./validations";
import { zCreateInvestmentParams } from "@repo/sdk/zod";
import { z } from "zod";

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

export const confirmInvestmentPaymentAction = actionClientWithAccount
	.schema(
		z.object({
			id: z.number().min(1),
			confirmationToken: z.string().min(1),
			returnURL: z.string().min(1),
		})
	)
	.action(
		async ({
			parsedInput: { id, confirmationToken, returnURL },
			ctx: { axiosClient },
		}) => {
			const resp = await confirmInvestmentPayment({
				client: axiosClient,
				path: {
					id,
				},
				body: {
					confirmation_token: confirmationToken,
					return_url: returnURL,
				},
			});

			return resp.data;
		}
	);

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
