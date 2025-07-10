import { getSessionFn } from "@/app/actions/auth";
import { ConnectIntegrationButton } from "./components/connect-integration-button";

export default async function DashboardPage() {
	const session = await getSessionFn();

	return (
		<div>
			<h1>Dashboard</h1>
			<p>
				Welcome{" "}
				{session?.user.firstName ??
					session?.user.lastName ??
					session?.user.email}
			</p>
			<ConnectIntegrationButton integration="quickbooks" />
			<ConnectIntegrationButton integration="google-sheet" />
		</div>
	);
}
