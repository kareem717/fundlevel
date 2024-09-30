import { UpdateAccountForm } from "@/components/auth/account/update-account-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function AccountSettingsPage() {
  return (
    <Card className="max-w-md h-min">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click update account when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <UpdateAccountForm />
      </CardContent>
    </Card>
  )
}