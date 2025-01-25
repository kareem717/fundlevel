import { VerifyOTPForm } from "@/components/auth/verify-otp-form";
import { getSessionAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";

export default async function OTPPage() {
  const session = await getSessionAction()

  if (session?.data) {
    return redirect(redirects.auth.logout)
  }

  return <VerifyOTPForm />
}