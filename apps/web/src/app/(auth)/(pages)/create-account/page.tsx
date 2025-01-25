import { getAccountAction, getUserAction } from "@/actions/auth";
import { CreateAccountForm } from "@/components/auth/create-account-form";
import { redirects } from "@/lib/config/redirects";
import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const userResult = await getUserAction()

  if (!userResult?.data) {
    return redirect(redirects.auth.login)
  }

  const result = await getAccountAction()

  if (result?.data) {
    return redirect(redirects.app.root)
  }

  const userFullName = userResult.data.user_metadata.full_name ?? ""
  const [firstName = "", lastName = ""] = userFullName.split(" ")

  return (
    <CreateAccountForm 
      defaultFirstName={firstName.toString()} 
      defaultLastName={lastName.toString()} 
    />
  )
}
