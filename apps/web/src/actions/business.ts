"use server";

import { actionClient, actionClientWithAccount } from "@/lib/safe-action";
import {
	createBusiness,
	getBusinessById,
	getAccountBusinesses as getAccountBusinessesApi,
	getBusinessRoundsByPage as getBusinessRoundsByPageApi,
	getBusinessMembersByPage as getBusinessMembersByPageApi,
	getBusinessMemberRoles as getBusinessMemberRolesApi,
	getBusinessRoundCreateRequirements as getBusinessCreateRoundrequirementsApi,
	onboardStripeConnectedAccount as onboardStripeConnectedAccountApi,
	getStripeDashboardUrl as getStripeDashboardUrlApi,
	getBusinessStripeAccount,
	upsertBusinessLegalSection as upsertBusinessLegalSectionApi,
} from "@repo/sdk";
import {
	zCreateBusinessParams,
	zUpsertBusinessLegalSectionParams,
} from "@repo/sdk/zod";
import { pathIdSchema, offsetPaginationSchema } from "./validations";
import { z } from "zod";
import { cache } from "react";

/**
 * Create a venture
 */
export const createBusinessAction = actionClientWithAccount
	.schema(zCreateBusinessParams)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const { data } = await createBusiness({
			client: axiosClient,
			body: parsedInput,
		});

		return data;
	});

/**
 * Get all businesses for the current account
 */
export const getBusinessesAction = cache(
	actionClientWithAccount.action(async ({ ctx: { axiosClient } }) => {
		const res = await getAccountBusinessesApi({
			client: axiosClient,
			throwOnError: true,
		});

		return res.data;
	})
);

/**
 * Get a business by id
 */
export const getBusinessAction = cache(
	actionClientWithAccount
		.schema(pathIdSchema)
		.action(async ({ parsedInput: id, ctx: { axiosClient } }) => {
			const res = await getBusinessById({
				client: axiosClient,
				throwOnError: true,
				path: { id },
			});

			return res.data;
		})
);

/**
 * Gets public business information by id
 */
export const getPublicBusinessAction = cache(
	actionClient
		.schema(pathIdSchema)
		.action(async ({ parsedInput: id, ctx: { axiosClient } }) => {
			const res = await getBusinessById({
				client: axiosClient,
				throwOnError: true,
				path: { id },
			});

			return res.data;
		})
);

export const getBusinessRoundsByPage = actionClientWithAccount
	.schema(
		z.object({
			businessId: pathIdSchema,
			pagination: offsetPaginationSchema,
		})
	)
	.action(
		async ({
			parsedInput: { businessId, pagination },
			ctx: { axiosClient },
		}) => {
			const res = await getBusinessRoundsByPageApi({
				client: axiosClient,
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

export const getBusinessMembersByPage = actionClientWithAccount
	.schema(
		z.object({
			businessId: pathIdSchema,
			pagination: offsetPaginationSchema,
		})
	)
	.action(
		async ({
			parsedInput: { businessId, pagination },
			ctx: { axiosClient },
		}) => {
			const res = await getBusinessMembersByPageApi({
				client: axiosClient,
				throwOnError: true,
				path: { id: businessId },
				query: { ...pagination },
			});

			return res.data;
		}
	);

export const getBusinessMemberRoles = actionClientWithAccount.action(
	async ({ ctx: { axiosClient } }) => {
		const res = await getBusinessMemberRolesApi({
			client: axiosClient,
			throwOnError: true,
		});

		return res.data;
	}
);

export const getBusinessCreateRoundrequirements = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput, ctx: { axiosClient } }) => {
		const res = await getBusinessCreateRoundrequirementsApi({
			client: axiosClient,
			throwOnError: true,
			path: { id: parsedInput },
		});

		return res.data;
	});

export const getStripeAccountSettingsLink = actionClientWithAccount
	.schema(
		z.object({
			id: pathIdSchema,
			refreshURL: z.string().url(),
			returnURL: z.string().url(),
		})
	)
	.action(
		async ({
			parsedInput: { id, refreshURL, returnURL },
			ctx: { axiosClient },
		}) => {
			const res = await onboardStripeConnectedAccountApi({
				client: axiosClient,
				throwOnError: true,
				query: {
					refreshURL,
					returnURL,
				},
				path: { id },
			});

			return res.data;
		}
	);

export const getStripeDashboardUrlAction = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput: id, ctx: { axiosClient } }) => {
		const res = await getStripeDashboardUrlApi({
			client: axiosClient,
			throwOnError: true,
			path: { id },
		});

		return res.data;
	});

export const getBusinessStripeAccountAction = actionClientWithAccount
	.schema(pathIdSchema)
	.action(async ({ parsedInput: id, ctx: { axiosClient } }) => {
		const res = await getBusinessStripeAccount({
			client: axiosClient,
			path: { id },
		});

		return res.data;
	});

export const upsertBusinessLegalSection = actionClientWithAccount
	.schema(
		z.object({
			id: pathIdSchema,
			...zUpsertBusinessLegalSectionParams.shape,
		})
	)
	.action(async ({ parsedInput: { id, ...params }, ctx: { axiosClient } }) => {
		await upsertBusinessLegalSectionApi({
			client: axiosClient,
			path: { id },
			body: params,
		});
	});
