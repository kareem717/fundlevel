import { getAccountAction, getUserAction } from "@/actions/auth";
import { CreateAccountForm } from "./components/create-account-form";
import { redirects } from "@/lib/config/redirects";
import { redirect } from "next/navigation";

export default async function CreateAccountPage() {
  const userResult = await getUserAction()

  if (!userResult?.data) {
    return redirect(redirects.auth.login)
  }

  const result = await getAccountAction()

  if (!!result?.data) {
    return redirect(redirects.app.index)
  }

  const user = userResult.data
  const userFullName = user.user_metadata.full_name

  let firstName = ""
  let lastName = ""

  if (userFullName) {
    [firstName, lastName] = userFullName.split(" ")
  }

  return <CreateAccountForm defaultEmail={user.email} defaultFirstName={firstName} defaultLastName={lastName} />
}
