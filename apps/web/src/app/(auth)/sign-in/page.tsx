import { redirect } from "next/navigation";
import { getSessionFn } from "@/app/actions/auth";
import { SignInForm } from "./components/sign-in-form";

export default async function SignInPage() {
	const { data: session } = await getSessionFn();

	if (session) {
		return redirect("/");
	}

	return <SignInForm />;
}
