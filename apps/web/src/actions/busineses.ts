"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	createBusiness as createBusinessApi,
	getBusinessVenturesByCursor as getBusinessVenturesApi,
	getBusinessById as getBusinessByIdApi,
	getAccountBusinesses as getAccountBusinessesApi,
	getBusinessTotalFunding,
	getBusinessVenturesByPage,
	getBusinessRoundsByPage as getBusinessRoundsByPageApi,
} from "@/lib/api";
import { createBusinessSchema } from "@/actions/validations/business";
import {
	cursorPaginationSchema,
	intIdSchema,
	offsetPaginationSchema,
} from "@/actions/validations/shared";
import { object } from "yup";

/**
 * Create a venture
 */
export const createBusiness = actionClientWithAccount
	.schema(createBusinessSchema)
	.action(
		async ({
			parsedInput: { address, business },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("User not found");
			}

			await createBusinessApi({
				client: apiClient,
				throwOnError: true,
				body: {
					address,
					business: {
						...business,
						ownerAccountId: account.id,
					},
				},
			});
		}
	);

export const getAccountBusinesses = actionClientWithAccount.action(
	async ({ ctx: { apiClient, account } }) => {
		if (!account) {
			throw new Error("User not found");
		}

		const res = await getAccountBusinessesApi({
			client: apiClient,
			throwOnError: true,
			path: {
				id: account.id,
			},
		});

		return res.data;
	}
);

export const getBusinessVentures = actionClientWithAccount
	.schema(
		object().shape({
			businessId: intIdSchema.required(),
			pagination: offsetPaginationSchema.required(),
		})
	)
	.action(
		async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
			const res = await getBusinessVenturesByPage({
				client: apiClient,
				throwOnError: true,
				query: {
					...pagination,
				},
				path: {
					id: businessId,
				},
			});

			return res.data;
		}
	);

export const getBusinessVenturesInfinite = actionClientWithAccount
	.schema(
		object().shape({
			businessId: intIdSchema.required(),
			pagination: cursorPaginationSchema.required(),
		})
	)
	.action(
		async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
			const res = await getBusinessVenturesApi({
				client: apiClient,
				throwOnError: true,
				query: {
					...pagination,
				},
				path: {
					id: businessId,
				},
			});

			return res.data;
		}
	);

export const getBusinessById = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput: id, ctx: { apiClient } }) => {
		const res = await getBusinessByIdApi({
			client: apiClient,
			throwOnError: true,
			path: { id },
		});

		return res.data;
	});

export const getBusinessRoundsByPage = actionClientWithAccount
	.schema(
		object().shape({
			businessId: intIdSchema.required(),
			pagination: offsetPaginationSchema.required(),
		})
	)
	.action(
		async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
			const res = await getBusinessRoundsByPageApi({
				client: apiClient,
				throwOnError: true,
				query: {
					...pagination,
				},
				path: {
					id: businessId,
				},
			});

			return res.data;
		}
	);

export const getBusinessFunding = actionClient
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const res = await getBusinessTotalFunding({
			client: apiClient,
			throwOnError: true,
			path: { id: parsedInput },
		});

		return res.data;
	});
