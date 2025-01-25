import { LogoutButtons } from "./components/logout-buttons";
import { redirect } from "next/navigation";
import { redirects } from "@/lib/config/redirects";
import { getSessionAction } from "@/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

export default async function LogoutPage() {
  const session = await getSessionAction()

  if (!session?.data) {
    return redirect(redirects.auth.login)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Are you sure?</CardTitle>
          <CardDescription>
            Logout from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogoutButtons />
        </CardContent>
      </Card>
    </div>
  )
}
