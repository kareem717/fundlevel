import { VerifyOTPForm } from "@/components/auth/verify-otp-form";
import { getSessionAction } from "@/actions/auth";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { LegalContainer } from "@/components/legal-container";

export default async function OTPPage() {
  const session = await getSessionAction()

  if (session?.data) {
    return redirect(redirects.auth.logout)
  }

  return (
    <LegalContainer>
      <Card className="flex flex-col gap-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Log In</CardTitle>
          <CardDescription>
            Enter the OTP sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyOTPForm />
        </CardContent>
      </Card>
    </LegalContainer >
  )
}