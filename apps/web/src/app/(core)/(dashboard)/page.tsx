import { getSessionFn } from "@fundlevel/web/app/actions/auth";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Home",
	description: "Home page",
};

export default async function DashboardPage() {
	const session = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
}
