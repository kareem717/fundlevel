"server-only";
import type { AppRouter } from "@fundlevel/api/_app";
import contract from "@fundlevel/api/contract";
import { getCookieHeaderFn } from "@fundlevel/web/app/actions/utils";
import { env } from "@fundlevel/web/env";
import { createORPCClient } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export const createServerORPCClient = async () => {
	const headers = await getCookieHeaderFn();
	const link = new OpenAPILink(contract as unknown as AppRouter, {
		url: env.NEXT_PUBLIC_SERVER_URL,
		headers,
		fetch: (request, init) =>
			globalThis.fetch(request, {
				...init,
				credentials: "include", // Include cookies for cross-origin requests
			}),
	});

	const client: JsonifiedClient<ContractRouterClient<AppRouter>> =
		createORPCClient(link);
	return createTanstackQueryUtils(client);
};
