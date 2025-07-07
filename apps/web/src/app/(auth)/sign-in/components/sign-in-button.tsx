"use client";

import { Button } from "@fundlevel/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import type { ComponentPropsWithRef } from "react";
import { toast } from "sonner";
import { useBindings } from "@/components/providers/bindings-provider";
import { authClient } from "@/lib/auth-client";

interface SignInButtonProps extends ComponentPropsWithRef<typeof Button> {
	provider: "google";
	callbackURL?: string;
}

export function SignInButton({
	className,
	provider,
	children = "Sign In",
	...props
}: SignInButtonProps) {
	const env = useBindings();
	const { mutate: signIn, isPending } = useMutation({
		mutationFn: async () =>
			await authClient(env.NEXT_PUBLIC_SERVER_URL).signIn.social({
				provider,
				callbackURL: env.NEXT_PUBLIC_BASE_URL,
			}),
		onError: (error) => {
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
			});
		},
		onSuccess: () => {
			toast.success("Redirecting...");
		},
	});

	return (
		<Button
			onClick={() => signIn()}
			className={className}
			{...props}
			disabled={isPending}
		>
			{children}
		</Button>
	);
}
