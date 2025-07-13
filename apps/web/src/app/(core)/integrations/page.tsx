import { ConnectIntegrationButton } from "./components/connect-integration-button";

export const metadata = {
	title: "Integrations",
	description: "Integrations connected to your account",
};

export default function IntegrationsPage() {
	return (
		<div>
			<h1>Integrations</h1>
			<ConnectIntegrationButton integration="quickbooks" />
			<ConnectIntegrationButton integration="google-sheet" />
		</div>
	);
}
