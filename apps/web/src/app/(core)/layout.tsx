import { ScrollArea } from "@fundlevel/ui/components/scroll-area";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@fundlevel/ui/components/sidebar";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionFn } from "../actions/auth";
import { AppSidebar } from "./components/app-sidebar";

export const metadata: Metadata = {
	title: {
		template: "%s | Fundlevel",
		default: "Fundlevel",
	},
	description: "Fundlevel",
};

export default async function CoreLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const session = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<SidebarProvider className="items-start">
			<AppSidebar user={session.user} />
			{/* TODO: idk y the styling works but it does */}
			<SidebarInset className="flex h-[calc(100vh-16px)] w-full flex-col gap-4 p-4">
				<header className="shrink-0">
					<SidebarTrigger />
				</header>
				<ScrollArea className="container mx-auto h-full">{children}</ScrollArea>
			</SidebarInset>
		</SidebarProvider>
	);
}
