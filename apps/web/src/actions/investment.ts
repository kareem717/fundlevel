"use server";

import { actionClientWithAccount } from "@/lib/safe-action";
import {
	getInvestmentById,
	confirmInvestmentPayment,
	getAccountInvestments,
	updateInvestment,
	upsertRoundInvestment,
	getAccountActiveRoundInvestment,
	getAccountInvestmentAggregate,
} from "@repo/sdk";
import { cache } from "react";
import { cursorPaginationSchema, pathIdSchema } from "./validations";
import {
	zCreateInvestmentParams,
	zInvestmentFilter,
	zUpdateInvestmentParams,
} from "@repo/sdk/zod";
import { z } from "zod";

export const getInvestmentByIdAction = cache(
	actionClientWithAccount
		.schema(pathIdSchema)
		.action(async ({ parsedInput, ctx: { axiosClient } }) => {
			console.log("getting investment", parsedInput);

			const resp = await getInvestmentById({
				client: axiosClient,
				path: {
					id: parsedInput,
				},
				throwOnError: true,
			});

			return resp.data;
		})
);

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

export const upsertInvestmentAction = actionClientWithAccount
	.schema(zCreateInvestmentParams)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const resp = await upsertRoundInvestment({
			client: axiosClient,
			body: parsedInput,
			throwOnError: true,
		});

		return resp.data;
	});

export const getAccountInvestmentsAction = actionClientWithAccount
	.schema(
		z.object({
			...cursorPaginationSchema.shape,
			filter: zInvestmentFilter.optional(),
		})
	)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		console.log("parsedInput", parsedInput);
		const resp = await getAccountInvestments({
			client: axiosClient,
			query: parsedInput,
			throwOnError: true,
		});

		console.log("resp", resp);
		return resp.data;
	});

export const updateInvestmentAction = actionClientWithAccount
	.schema(
		z.object({
			id: pathIdSchema,
			...zUpdateInvestmentParams.shape,
		})
	)
	.action(async ({ parsedInput: { id, ...body }, ctx: { axiosClient } }) => {
		const resp = await updateInvestment({
			client: axiosClient,
			path: {
				id,
			},
			body,
			throwOnError: true,
		});

		return resp.data;
	});

export const getActiveRoundInvestmentAction = cache(
	actionClientWithAccount
		.schema(pathIdSchema)
		.action(async ({ parsedInput, ctx: { axiosClient } }) => {
			const resp = await getAccountActiveRoundInvestment({
				client: axiosClient,
				path: {
					id: parsedInput,
				},
				throwOnError: true,
			});

			return resp.data;
		})
);

export const getInvestmentAggregateAction = actionClientWithAccount
	.action(async ({ ctx: { axiosClient } }) => {
		const resp = await getAccountInvestmentAggregate({
			client: axiosClient,
		});

		return resp.data;
	});
