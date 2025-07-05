import { ScrollArea } from "@fundlevel/ui/components/scroll-area";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionFunction } from "@/functions/auth";
import { DashboardSidebar } from "./-components/dashboard-sidebar";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
	beforeLoad: async ({ location }) => {
		//TODO: move to a cached fn, clear on sign out
		const { data } = await getSessionFunction();

		if (!data) {
			throw redirect({
				to: "/sign-in",
				search: {
					//TODO: change this to the actual URL
					redirect: "https://localhost:3001" + location.href,
				},
			});
		}
		return {
			user: data.user,
		};
	},
});

function DashboardLayout() {
	const { user } = Route.useRouteContext();

	return (
		<div className="flex h-full w-full">
			<DashboardSidebar user={user}>
				<ScrollArea className="container mx-auto h-screen p-4">
					<Outlet />
				</ScrollArea>
			</DashboardSidebar>
		</div>
	);
}
