import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { getSessionFunction } from "../../functions/auth";
import { SignInForm } from "./-components/sign-in-form";

export const Route = createFileRoute("/_auth/sign-in")({
	component: RouteComponent,
	beforeLoad: async () => {
		const { data } = await getSessionFunction();

		if (data) {
			throw redirect({
				to: "/",
			});
		}
	},
	validateSearch: zodValidator(
		z.object({
			redirect: z.string().optional(),
		}),
	),
});

function RouteComponent() {
	const { redirect } = Route.useSearch();

	//TODO: change this to the actual URL
	return (
		<SignInForm callbackURL={"http://localhost:3001" + (redirect ?? "/")} />
	);
}
