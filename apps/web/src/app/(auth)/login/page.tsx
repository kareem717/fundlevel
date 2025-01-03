import { LoginForm } from "./componenets/login-form";
import redirects from "@/lib/config/redirects";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";

export default async function LoginPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (user) {
		return redirect(redirects.auth.afterLogin);
	}

	return (
		<div className="mx-auto w-full max-w-[350px]">
			<LoginForm />
		</div>
	);
}
