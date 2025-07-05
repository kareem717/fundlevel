import { getSessionFn } from "@web/app/actions/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "./components/sign-in-form";

export default async function SignInPage() {
	const { data: session } = await getSessionFn();

	if (session) {
		return redirect("/");
	}

	return <SignInForm />;
}
