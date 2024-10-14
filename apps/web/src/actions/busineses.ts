"use server";

import { actionClient } from "@/lib/safe-action";
import {
	createBusiness as createBusinessApi,
	getBusinessVentures as getBusinessVenturesApi,
	getBusinessById as getBusinessByIdApi,
	getAccountBusinesses as getAccountBusinessesApi,
} from "@/lib/api";
import { createBusinessSchema } from "@/lib/validations/business";
import { cursorPaginationSchema, intIdSchema } from "@/lib/validations/shared";
import { object } from "yup";

/**
 * Create a venture
 */
export const createBusiness = actionClient
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
						status: "pending",
					},
				},
			});
		}
	);

export const getAccountBusinesses = actionClient.action(
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

export const getBusinessVentures = actionClient
	.schema(object().shape({
		businessId: intIdSchema.required(),
		pagination: cursorPaginationSchema
	}))
	.action(async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
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
	});

export const getBusinessById = actionClient
	.schema(intIdSchema.required())
	.action(async ({ parsedInput: id, ctx: { apiClient } }) => {
		const res = await getBusinessByIdApi({
			client: apiClient,
			throwOnError: true,
			path: { id },
		});

		return res.data;
	});
