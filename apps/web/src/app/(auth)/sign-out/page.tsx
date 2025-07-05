import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@fundlevel/ui/components/card";
import { getSessionFn } from "@web/app/actions/auth";
import { redirects } from "@web/lib/config/redirects";
import { redirect } from "next/navigation";
import { SignOutButtons } from "./components/sign-out-buttons";

export default async function SignOutPage() {
	const { data: session } = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Are you sure you want to sign out?</CardTitle>
				<CardDescription>
					You will be logged out of your account.
				</CardDescription>
			</CardHeader>
			<CardFooter>
				<SignOutButtons className="w-full" />
			</CardFooter>
		</Card>
	);
}
