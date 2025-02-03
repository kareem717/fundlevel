import { redirects } from "@/lib/config/redirects";
import { type NextRequest, NextResponse } from "next/server";
import { getAccountAction, getUserAction } from "@/actions/auth";

export const USER_HEADER_KEY = "user";
export const ACCOUNT_HEADER_KEY = "account";

export const updateSession = async (request: NextRequest) => {
	// This `try/catch` block is only here for the interactive tutorial.
	// Feel free to remove once you have Supabase connected.
	try {
		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		//TODO: handle error
		const user = (await getUserAction())?.data;

		if (!user) {
			if (
				request.nextUrl.pathname.includes(redirects.auth.createAccount) ||
				request.nextUrl.pathname.includes(redirects.auth.logout) ||
				request.nextUrl.pathname.includes(redirects.app.root)
			) {
				return NextResponse.redirect(
					new URL(redirects.auth.login, request.url)
				);
			}
		} else {
			if (
				request.nextUrl.pathname.includes(redirects.auth.login) ||
				request.nextUrl.pathname.includes(redirects.auth.otp()) ||
				request.nextUrl.pathname.includes(redirects.auth.callback())
			) {
				return NextResponse.redirect(
					new URL(redirects.auth.logout, request.url)
				);
			}
		}

		const account = (await getAccountAction())?.data;

		// protected routes
		if (account) {
			if (request.nextUrl.pathname.includes(redirects.auth.createAccount)) {
				return NextResponse.redirect(new URL(redirects.app.root, request.url));
			}
		} else {
			if (request.nextUrl.pathname.includes(redirects.app.root)) {
				return NextResponse.redirect(
					new URL(redirects.auth.createAccount, request.url)
				);
			}
		}

		const headers = new Headers(request.headers);
		headers.set(USER_HEADER_KEY, user ? JSON.stringify(user) : "{}");
		headers.set(ACCOUNT_HEADER_KEY, account ? JSON.stringify(account) : "{}");

		return NextResponse.next({
			request: {
				headers,
			},
		});
	} catch {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
