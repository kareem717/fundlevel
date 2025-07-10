import { getCloudflareContext } from "@opennextjs/cloudflare";
import { redirect } from "next/navigation";
import { getSessionFn } from "@/app/actions/auth";
import { getCookieHeaderFn } from "@/app/actions/utils";
import { apiClient } from "@/lib/api-client";
import { redirects } from "@/lib/config/redirects";

export async function GET() {
	const session = await getSessionFn();

	if (session) {
		return redirect(redirects.home);
	}

	const { env } = await getCloudflareContext({ async: true });
	const headers = await getCookieHeaderFn();

	const response = await apiClient(env.NEXT_PUBLIC_SERVER_URL, headers).auth[
		"sign-in"
	].$get();

	if (response.status === 200) {
		const data = await response.json();

		return redirect(data.redirectUrl);
	}
	//TODO: Handle error
	const error = await response.json();
	throw new Error(error.message);
}
