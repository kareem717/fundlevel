import { getSessionFn } from "@web/app/actions/auth";
import { ConnectIntegrationButton } from "./components/connect-integration-button";

export default async function DashboardPage() {
	const { data: session } = await getSessionFn();

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<ConnectIntegrationButton />
		</div>
	);
}
