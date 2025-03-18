import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@fundlevel/ui/components/card";
import { LegalContainer } from "@/components/legal-container";

export default async function LoginPage() {
  return (
    <LegalContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your email</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </LegalContainer>
  );
}
