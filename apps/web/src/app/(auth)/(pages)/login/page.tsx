import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionAction } from "@/actions/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/card";
import { LegalContainer } from "@/components/legal-container";

export default async function LoginPage() {
  const session = await getSessionAction()

  if (session?.data) {
    return redirect(redirects.auth.logout)
  }

  return (
    <LegalContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </LegalContainer>
  )
}
