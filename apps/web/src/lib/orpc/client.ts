import type { AppRouter } from "@fundlevel/api/_app";
import contract from "@fundlevel/api/contract";
import { env } from "@fundlevel/web/env";
import { createORPCClient, ORPCError } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			retry: (failureCount, error) => {
				if (error instanceof ORPCError) {
					return false;
				}
				// only retry unhandled errors
				return failureCount <= 1;
			},
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message || "Please try again.",
				action: {
					label: "Retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

const link = new OpenAPILink(contract as unknown as AppRouter, {
	url: env.NEXT_PUBLIC_SERVER_URL,
	fetch: (request, init) =>
		globalThis.fetch(request, {
			...init,
			credentials: "include", // Include cookies for cross-origin requests
		}),
});

export const client: JsonifiedClient<ContractRouterClient<AppRouter>> =
	createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
