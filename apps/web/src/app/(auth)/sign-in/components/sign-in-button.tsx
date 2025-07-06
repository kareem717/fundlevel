"use client";
import { Button } from "@fundlevel/ui/components/button";
import { authClient } from "@web/lib/auth-client";
import { type ComponentPropsWithRef, useState } from "react";

interface SignInButtonProps extends ComponentPropsWithRef<typeof Button> {
	provider: "google";
	callbackURL?: string;
}

export function SignInButton({
	className,
	provider,
	callbackURL = "http://localhost:3001",
	children = "Sign In",
	...props
}: SignInButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogin() {
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
			callbackURL: callbackURL.replace(/\/$/, ""),

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
