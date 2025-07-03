import { Toaster } from "@fundlevel/ui/components/sonner";
import appCss from "@fundlevel/ui/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import Loader from "@/components/loader";
import type { orpc } from "@/utils/orpc";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My App",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	const isFetching = useRouterState({ select: (s) => s.isLoading });

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{isFetching ? <Loader /> : <Outlet />}
				<Toaster richColors />
				{/* <TanStackRouterDevtools position="bottom-left" />
				<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" /> */}
				<Scripts />
			</body>
		</html>
	);
}
