import { getSessionFn } from "@fundlevel/web/app/actions/auth";
import { getCookieHeaderFn } from "@fundlevel/web/app/actions/utils";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { createServerORPCClient } from "@fundlevel/web/lib/orpc/server";
import { redirect } from "next/navigation";

export async function GET() {
	const session = await getSessionFn();

	if (session) {
		return redirect(redirects.app.index);
	}

	const orpc = await createServerORPCClient();

	const resp = await orpc.auth.signIn.call();

	if (resp.shouldRedirect) {
		return redirect(resp.location);
	}

	return resp;
}
