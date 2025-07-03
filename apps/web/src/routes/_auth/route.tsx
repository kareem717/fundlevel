import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NavBack } from "@/components/nav-back";

export const Route = createFileRoute("/_auth")({
	component: AuthLayout,
});

export function AuthLayout() {
	return (
		<div className="relative flex h-screen w-full items-center justify-center bg-accent p-4">
			<NavBack className="absolute top-4 left-4" />
			<Outlet />
		</div>
	);
}
