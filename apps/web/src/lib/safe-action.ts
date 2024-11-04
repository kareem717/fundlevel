import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { yupAdapter } from "next-safe-action/adapters/yup";
import { env } from "@/env";
import { createClient as createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { ErrorModel, getUserAccount } from "./api";
import { createClient } from "@hey-api/client-fetch";

export const actionClient = createSafeActionClient({
	validationAdapter: yupAdapter(),
	handleServerError: async (error, utils) => {
		console.log("utils", utils)
		console.log("error", error)
		try {
			const err = JSON.parse(error.message) as ErrorModel; // Attempt to cast to ErrorModel
			console.error(err);

			return {
				message: err.detail ?? DEFAULT_SERVER_ERROR_MESSAGE,
				statusCode: err.status ?? 500,
			};
		} catch (error) {
			console.error(
				JSON.stringify(
					{
						message:
							"An error occured while trying to parse the error response from the server. This tends to happen when the error returned is an empty JSON object, or the error response was not the result of the server's error handling middleware.",
						rawResponse: error,
					},
					null,
					2
				)
			);

			return {
				message: DEFAULT_SERVER_ERROR_MESSAGE,
				statusCode: 500,
			};
		}
	},
}).use(async ({ next }) => {
	const client = createClient({
		baseUrl: env.NEXT_PUBLIC_BACKEND_API_URL,
	});

	return next({
		ctx: {
			apiClient: client,
		},
	});
});

export const actionClientWithUser = actionClient.use(async ({ next, ctx }) => {
	const sb = await createSupabaseServerClient();

	const {
		data: { session },
		error: sessionError,
	} = await sb.auth.getSession();

	if (sessionError) {
		console.error("Error getting user session: ", sessionError);
	}

	let user = null;
	if (session) {
		ctx.apiClient.setConfig({
			headers: {
				Authorization: `Bearer ${session?.access_token}`,
			},
		});

		const { data, error } = await sb.auth.getUser();

		if (error) {
			console.error("Error getting user: ", error);
		}

		user = data?.user;
	}

	return next({
		ctx: {
			...ctx,
			user,
		},
	});
});

export const actionClientWithAccount = actionClientWithUser.use(
	async ({ next, ctx }) => {
		let account;
		if (ctx.user?.id) {
			const { data, error } = await getUserAccount({
				client: ctx.apiClient,
				path: {
					userId: ctx.user?.id,
				},
			});

			if (error) {
				if (error.status !== 404) {
					console.error("Error getting account by user id: ", error);
				}
			}

			account = data?.account;
		}

		return next({
			ctx: {
				...ctx,
				account,
			},
		});
	}
);
