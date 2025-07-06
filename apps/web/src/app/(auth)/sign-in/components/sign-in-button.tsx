"use client";

import { Button } from "@fundlevel/ui/components/button";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { useMutation } from "@tanstack/react-query";
import type { ComponentPropsWithRef } from "react";
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
	const { mutate: signIn, isPending } = useMutation({
		mutationFn: async () =>
			await authClient().signIn.social({
				provider,
				callbackURL: getCloudflareContext().env.NEXT_PUBLIC_BASE_URL,
			}),
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
