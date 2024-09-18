import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { yupAdapter } from "next-safe-action/adapters/yup";
import { env } from "@/env";
import supabase from "@/lib/utils/supabase/server";
import { ErrorModel, getAccountByUserId } from "./api";
import { createClient } from "@hey-api/client-fetch";

class ActionError extends Error {
	constructor(message: string, public statusCode: number) {
		super(message);
	}
}

const apiClient = (accessToken?: string) => {
	return createClient({
		// set default base url for requests made by this client
		baseUrl: env.NEXT_PUBLIC_BACKEND_API_URL,
		/**
		 * Set default headers only for requests made by this client. This is to
		 * demonstrate local clients and their configuration taking precedence over
		 * global configuration.
		 */
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

export const actionClient = createSafeActionClient({
	validationAdapter: yupAdapter(),
	handleServerError: async (error) => {
		console.log(error);

		const err = error as ErrorModel;

		if (err.detail) {
			return new ActionError(err.detail, err.status ?? 500);
		}

		return new ActionError(DEFAULT_SERVER_ERROR_MESSAGE, 500);
	},
}).use(async ({ next }) => {
	const sb = supabase();

	const {
		data: { session },
		error: sessionError,
	} = await sb.auth.getSession();

	if (sessionError) {
		console.error("Error getting user session: ", sessionError);
	}

	const {
		data: { user },
		error,
	} = await sb.auth.getUser();

	if (error) {
		console.error("Error getting user: ", error);
	}

	const client = apiClient(session?.access_token);

	let account;
	if (user?.id) {
		const { data, error } = await getAccountByUserId({
			client,
			path: {
				userId: user?.id,
			},
		});

		if (error) {
			if (error.status !== 404) {
				console.error("Error getting account by user id: ", error);
			}
		}

		account = data;
	}

	console.log("access_token", session?.access_token);
	console.log("user_id", user?.id);
	return next({
		ctx: {
			apiClient: apiClient(session?.access_token),
			user: user,
			account: account?.account,
		},
	});
});
