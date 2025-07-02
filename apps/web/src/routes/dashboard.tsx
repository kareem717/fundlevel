import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { LinkInboxButton } from "@/components/LinkInboxButton";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { data: session, isPending } = authClient.useSession();

	const privateData = useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			navigate({
				to: "/login",
			});
		}
	}, [session, isPending]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600">Welcome back, {session?.user.name}!</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Inbox Listener Section */}
					<div className="col-span-1 md:col-span-2">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">
							Inbox Listener
						</h2>
						<p className="text-gray-600 mb-6">
							Automatically process documents from client emails by linking your business Gmail account.
						</p>
						<LinkInboxButton />
					</div>

					{/* Connected Inboxes */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Connected Inboxes
						</h3>
						<div className="text-sm text-gray-500">
							No inboxes connected yet. Link your first Gmail account to get started.
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Recent Activity
						</h3>
						<div className="text-sm text-gray-500">
							No recent activity. Connect an inbox to start processing emails.
						</div>
					</div>
				</div>

				{/* Debug Info */}
				{privateData.data && (
					<div className="mt-8 bg-gray-100 p-4 rounded-lg">
						<h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
						<p className="text-xs text-gray-600">{privateData.data.message}</p>
					</div>
				)}
			</div>
		</div>
	);
}
