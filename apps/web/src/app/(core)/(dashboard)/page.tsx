import { orpc } from "@fundlevel/web/lib/orpc/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
	description: "Home page",
};

export default async function DashboardPage() {
	const healthCheck = await orpc.health.check.call();

	return (
		<div>
			<h1>Dashboard</h1>
			<pre>{JSON.stringify(healthCheck, null, 2)}</pre>
		</div>
	);
}
