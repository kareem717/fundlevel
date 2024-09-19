import { UpdateAccountForm } from "@/components/auth/account/update-account-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAccount } from "@/actions/auth";

export default async function AccountSettingsPage() {
  const accountResponse = await getAccount();

  if (!accountResponse?.data) {
    throw new Error("Account not found");
  }

  return (
    <Card className="max-w-md h-min">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click update account when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <UpdateAccountForm account={accountResponse.data} />
      </CardContent>
    </Card>
  )
}