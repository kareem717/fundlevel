import { getAccount } from "@/actions/auth";
import { CreateAccountForm } from "@/components/auth/account/create-account-form";
import redirects from "@/lib/config/redirects";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Add this line˝

export default async function CreateAccountPage() {
	const result = await getAccount()

	if (result?.serverError || result?.validationErrors) {
		const msg = result?.serverError?.message || "An unknown error occurred"
		throw new Error(msg)
	} else if (result?.data) {
		console.log("redirecting to", result.data)
		redirect(redirects.auth.afterLogin)
	}

	return (
		<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p className="text-sm text-muted-foreground">Finish setting up your account to get started</p>
			</div>
			<div className="mx-auto w-full max-w-[350px]">
				<CreateAccountForm />
			</div>
		</div>
	);

}
