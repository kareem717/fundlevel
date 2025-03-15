import { createAccountAction } from "@/actions/auth";
import { env } from "@/env";
import { redirects } from "@/lib/config/redirects";
import { NextResponse } from "next/server";

export async function GET() {
  const response = await createAccountAction();

  if (!response?.data) {
    throw new Error("Error creating account");
  }
  
  // URL to redirect to after sign up process completes
  return NextResponse.redirect(env.NEXT_PUBLIC_APP_URL + redirects.auth.afterLogin);
}
