import { redirects } from "@/lib/config/redirects";
import { type NextRequest, NextResponse } from "next/server";
import { getAccountAction, getUserAction } from "@/actions/auth";

export const updateSession = async (request: NextRequest) => {
  try {
    // Get user data, refreshing session if expired
    const user = (await getUserAction())?.data;
    const pathname = request.nextUrl.pathname;

    // Handle unauthenticated user
    if (!user) {
      // Only redirect to login if trying to access protected routes
      if (
        pathname.includes(redirects.app.root) ||
        pathname.includes(redirects.auth.logout)
      ) {
        return NextResponse.redirect(
          new URL(redirects.auth.login, request.url),
        );
      }

      // Allow unauthenticated access to public routes including createAccount
      return NextResponse.next();
    }

    // Check if user has an account before handling more redirects
    const account = (await getAccountAction())?.data;

    // Handle authenticated user trying to access auth pages
    if (
      pathname.includes(redirects.auth.login) ||
      pathname.includes(redirects.auth.otp()) ||
      pathname.includes(redirects.auth.callback())
    ) {
      return NextResponse.redirect(new URL(redirects.auth.logout, request.url));
    }

    // Handle account-specific redirects
    if (account) {
      // If user has account and tries to access createAccount, redirect to app
      if (pathname.includes(redirects.auth.createAccount)) {
        return NextResponse.redirect(new URL(redirects.app.root, request.url));
      }
    } else {
      // Only redirect to createAccount if they're trying to access app routes
      // and are not already on the createAccount page
      if (
        pathname.includes(redirects.app.root) &&
        !pathname.includes(redirects.auth.createAccount)
      ) {
        return NextResponse.redirect(
          new URL(redirects.auth.createAccount, request.url),
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Supabase client creation failed, likely due to missing environment variables
    console.error("Supabase client error:", error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
