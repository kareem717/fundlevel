"use client";

import { Button } from "@fundlevel/ui/components/button";
import { useMutation } from "@tanstack/react-query";
import type { ComponentPropsWithRef } from "react";
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
	const baseUrl = useBindings().NEXT_PUBLIC_SERVER_URL;
	const { mutate: signIn, isPending } = useMutation({
		mutationFn: async () =>
			await authClient(baseUrl).signIn.social({
				provider,
				callbackURL: baseUrl,
			}),
		throwOnError: true,
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
