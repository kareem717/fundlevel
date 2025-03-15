import { LogoutButtons } from "./components/logout-buttons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";

export default async function LogoutPage() {
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
