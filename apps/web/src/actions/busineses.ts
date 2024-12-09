"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	createBusiness as createBusinessApi,
	getBusinessById as getBusinessByIdApi,
	getAccountBusinesses as getAccountBusinessesApi,
	getBusinessRoundsByPage as getBusinessRoundsByPageApi,
	getBusinessTotalFunding,
	getBusinessInvestmentsByPage as getBusinessInvestmentsByPageApi,
	getBusinessMembersByPage as getBusinessMembersByPageApi,
	getBusinessMemberRoles as getBusinessMemberRolesApi,
	getBusinessRoundCreateRequirements as getBusinessCreateRoundrequirementsApi,
	onboardStripeConnectedAccount as onboardStripeConnectedAccountApi,
	getStripeDashboardUrl as getStripeDashboardUrlApi,
} from "@/lib/api";
import { createBusinessSchema } from "@/actions/validations/business";
import {
	intIdSchema,
	offsetPaginationSchema,
} from "@/actions/validations/shared";
import { object, string } from "yup";
/**
 * Create a venture
 */
export const createBusiness = actionClientWithAccount
	.schema(createBusinessSchema)
	.action(
		async ({
			parsedInput: { business, industryIds },
			ctx: { apiClient, account },
		}) => {
			if (!account) {
				throw new Error("User not found");
			}

			await createBusinessApi({
				client: apiClient,
				throwOnError: true,
				body: {
					business: {
						...business,
					},
					industryIds,
					initialOwnerId: account.id,
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

export const getBusinessInvestmentsByPage = actionClientWithAccount
	.schema(
		object().shape({
			businessId: intIdSchema.required(),
			pagination: offsetPaginationSchema.required(),
		})
	)
	.action(
		async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
			const res = await getBusinessInvestmentsByPageApi({
				client: apiClient,
				throwOnError: true,
				path: {
					id: businessId,
				},
				query: {
					...pagination,
				},
			});

			return res.data;
		}
	);

export const getBusinessMembersByPage = actionClientWithAccount
	.schema(
		object().shape({
			businessId: intIdSchema.required(),
			pagination: offsetPaginationSchema.required(),
		})
	)
	.action(
		async ({ parsedInput: { businessId, pagination }, ctx: { apiClient } }) => {
			const res = await getBusinessMembersByPageApi({
				client: apiClient,
				throwOnError: true,
				path: { id: businessId },
				query: { ...pagination },
			});

			return res.data;
		}
	);

export const getBusinessMemberRoles = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const res = await getBusinessMemberRolesApi({
			client: apiClient,
			throwOnError: true,
			path: { id: parsedInput },
		});

		return res.data;
	});

export const getBusinessCreateRoundrequirements = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput, ctx: { apiClient } }) => {
		const res = await getBusinessCreateRoundrequirementsApi({
			client: apiClient,
			throwOnError: true,
			path: { id: parsedInput },
		});

		return res.data;
	});

export const getStripeAccountSettingsLink = actionClientWithAccount
	.schema(
		object().shape({
			id: intIdSchema.required(),
			refreshURL: string().url().required(),
			returnURL: string().url().required(),
		})
	)
	.action(
		async ({
			parsedInput: { id, refreshURL, returnURL },
			ctx: { apiClient },
		}) => {
			const res = await onboardStripeConnectedAccountApi({
				client: apiClient,
				throwOnError: true,
				body: {
					refreshURL,
					returnURL,
				},
				path: { id },
			});

			return res.data;
		}
	);

export const getStripeDashboardUrl = actionClientWithAccount
	.schema(intIdSchema.required())
	.action(async ({ parsedInput: id, ctx: { apiClient } }) => {
		const res = await getStripeDashboardUrlApi({
			client: apiClient,
			throwOnError: true,
			path: { id },
		});

		return res.data;
	});
