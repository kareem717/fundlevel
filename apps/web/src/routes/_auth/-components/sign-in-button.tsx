import { Button } from "@fundlevel/ui/components/button";
import { type ComponentPropsWithRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface SignInButtonProps extends ComponentPropsWithRef<typeof Button> {
	provider: "google";
	redirect?: string;
}

export function SignInButton({
	className,
	provider,
	redirect = "http://localhost:3001", //TODO: change this to the actual URL
	children = "Sign In",
	...props
}: SignInButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin() {
		console.log("handleLogin", provider, redirect);
		setIsLoading(true);

		await authClient.signIn.social({
			/**
			 * The social provider id
			 * @example "github", "google", "apple"
			 */
			provider,
			/**
			 * A URL to redirect after the user authenticates with the provider
			 * @default "/"
			 */
			callbackURL: redirect,
			/**
			 * A URL to redirect if an error occurs during the sign in process
			 */
			// errorCallbackURL: "/error",
			/**
			 * A URL to redirect if the user is newly registered
			 */
			// newUserCallbackURL: "qahwa-app://",
			/**
			 * disable the automatic redirect to the provider.
			 * @default false
			 */
			// disableRedirect: true,
			fetchOptions: {
				onError: (error) => {
					setIsLoading(false);
					console.error(error);
				},
			},
		});
	}

	return (
		<Button
			onClick={handleLogin}
			className={className}
			{...props}
			disabled={isLoading}
		>
			{children}
		</Button>
	);
}
