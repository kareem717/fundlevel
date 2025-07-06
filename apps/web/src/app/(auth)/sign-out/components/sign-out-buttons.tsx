"use client";

import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { ErrorContext } from "better-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithRef } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { redirects } from "@/lib/config/redirects";

interface SignOutButtonsProps extends ComponentPropsWithRef<"div"> {
	onSuccess?: () => void;
}

export function SignOutButtons({
	className,
	onSuccess,
	...props
}: SignOutButtonsProps) {
	const router = useRouter();

	const { mutate: signOut, isPending } = useMutation({
		mutationFn: async () => {
			const { data, error } = await authClient.signOut({
				fetchOptions: {
					onError: (error: ErrorContext) => {
						console.error(error);
					},
				},
			});

			if (error) {
				throw error;
			}

			return data;
		},
		onSuccess: (data) => {
			if (data?.success) {
				onSuccess?.();
				router.push(redirects.home);
			} else {
				toast.error("Failed to sign out");
			}
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to sign out");
		},
	});

	return (
		<div className={cn("grid grid-cols-2 gap-2", className)} {...props}>
			<Button onClick={() => router.back()} variant="secondary">
				Cancel
			</Button>
			<Button onClick={() => signOut()} disabled={isPending}>
				{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
				Logout
			</Button>
		</div>
	);
}
