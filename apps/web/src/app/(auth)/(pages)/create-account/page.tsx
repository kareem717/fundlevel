import { getUserAction } from "@/actions/auth";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { LegalContainer } from "@/components/legal-container";
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@repo/ui/components/card";

export default async function CreateAccountPage() {
  const user = (await getUserAction())?.data

  if (!user) {
    throw new Error("User not found")
  }

  const userFullName = user.user_metadata.full_name ?? ""
  const [firstName = "", lastName = ""] = userFullName.split(" ")

  return (
    <LegalContainer>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAccountForm
            defaultFirstName={firstName.toString()}
            defaultLastName={lastName.toString()}
          />
        </CardContent>
      </Card>
    </LegalContainer>
  )
}
