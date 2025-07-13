import { IntegrationList } from "./components/integration-list";

export const metadata = {
	title: "Integrations",
	description: "Integrations connected to your account",
};

export default function IntegrationsPage() {
	return (
		<div className="container mx-auto space-y-14 p-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="font-bold text-3xl text-foreground">Integrations</h1>
				<p className="text-muted-foreground">
					Connect and manage your integrations to extend functionality
				</p>
			</div>

			{/* Integration List */}
			<IntegrationList className="w-full space-y-20" />
		</div>
	);
}
