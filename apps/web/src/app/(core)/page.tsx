"use client";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { ConnectIntegrationButton } from "./components/connect-integration-button";

// export const metadata: Metadata = {
// 	title: "Dashboard",
// };

export default function DashboardPage() {
	// const session = await getSessionFn();

	const healthCheck = useQuery(
		orpc.health.check.queryOptions({
			input: {
				name: "John",
			},
		}),
	);

	return (
		<div>
			<h1>Dashboard</h1>
			<pre>{JSON.stringify(healthCheck.data, null, 2)}</pre>
			<ConnectIntegrationButton integration="quickbooks" />
			<ConnectIntegrationButton integration="google-sheet" />
		</div>
	);
}
