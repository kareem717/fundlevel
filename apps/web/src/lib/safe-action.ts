import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { yupAdapter } from "next-safe-action/adapters/yup";
import { env } from "@/env";
import { createClient as createSupabaseServerClient } from "@/lib/utils/supabase/server";
import { ErrorModel, getUserAccount } from "./api";
import { createClient } from "@hey-api/client-fetch";

const apiClient = (accessToken?: string) => {
	return createClient({
		// set default base url for requests made by this client
		baseUrl: env.NEXT_PUBLIC_BACKEND_API_URL,
		/**
		 * Set default headers only for requests made by this client. This is to
		 * demonstrate local clients and their configuration taking precedence over
		 * global configuration.
		 */
		headers: accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
			  }
			: undefined,
	});
};

export const actionClient = createSafeActionClient({
	validationAdapter: yupAdapter(),
	handleServerError: async (error) => {
		const err = JSON.parse(error.message) as ErrorModel; // Attempt to cast to ErrorModel
		console.error(err);

		return {
			message: err.detail ?? DEFAULT_SERVER_ERROR_MESSAGE,
			statusCode: err.status ?? 500,
		};
	},
}).use(async ({ next }) => {
	const client = apiClient();

	return next({
		ctx: {
			apiClient: client,
		},
	});
});

export const actionClientWithUser = createSafeActionClient({
	validationAdapter: yupAdapter(),
	handleServerError: async (error) => {
		const err = JSON.parse(error.message) as ErrorModel; // Attempt to cast to ErrorModel
		console.error(err);

		return {
			message: err.detail ?? DEFAULT_SERVER_ERROR_MESSAGE,
			statusCode: err.status ?? 500,
		};
	},
}).use(async ({ next }) => {
	const sb = await createSupabaseServerClient();

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

	console.log("access_token", session?.access_token);
	console.log("user_id", user?.id);
	return next({
		ctx: {
			apiClient: apiClient(session?.access_token),
			user,
		},
	});
});

export const actionClientWithAccount = createSafeActionClient({
	validationAdapter: yupAdapter(),
	handleServerError: async (error) => {
		const err = JSON.parse(error.message) as ErrorModel; // Attempt to cast to ErrorModel
		console.error(err);

		return {
			message: err.detail ?? DEFAULT_SERVER_ERROR_MESSAGE,
			statusCode: err.status ?? 500,
		};
	},
}).use(async ({ next }) => {
	const sb = await createSupabaseServerClient();

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
		const { data, error } = await getUserAccount({
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

		account = data?.account;
	}

	console.log("access_token", session?.access_token);
	console.log("user_id", user?.id);
	return next({
		ctx: {
			apiClient: apiClient(session?.access_token),
			user,
			account,
		},
	});
});
