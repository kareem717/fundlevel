import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionFn } from "../actions/auth";

export default async function AuthLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const session = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<main className="flex h-screen w-screen items-center justify-center">
			{children}
		</main>
	);
}
