import { ScrollArea } from "@fundlevel/ui/components/scroll-area";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { redirects } from "@/lib/config/redirects";
import { getSessionFn } from "../actions/auth";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { data: session } = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<div className="flex h-full w-full">
			<DashboardSidebar user={session.user}>
				<ScrollArea className="container mx-auto h-screen p-4">
					{children}
				</ScrollArea>
			</DashboardSidebar>
		</div>
	);
}
