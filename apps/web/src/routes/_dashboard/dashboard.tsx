import { Button } from "@fundlevel/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import { useNango } from "@/hooks/use-nango";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_dashboard/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: session } = authClient.useSession();
	const { connect } = useNango({
		onConnect: () => {
			console.log("connected");
		},
		onClose: () => {
			console.log("closed");
		},
	});

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<Button onClick={() => connect()}>Connect</Button>
		</div>
	);
}
