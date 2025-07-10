"use client";

import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithRef } from "react";
import { toast } from "sonner";
import { getCookieHeaderFn } from "@/app/actions/auth";
import { useBindings } from "@/components/providers/bindings-provider";
import { apiClient } from "@/lib/api-client";

interface SignOutButtonsProps extends ComponentPropsWithRef<"div"> {
	onSuccess?: () => void;
}

export function SignOutButtons({
	className,
	onSuccess,
	...props
}: SignOutButtonsProps) {
	const router = useRouter();
	const baseUrl = useBindings().NEXT_PUBLIC_SERVER_URL;

	const { mutate: signOut, isPending } = useMutation({
		mutationFn: async () => {
			const headersList = await getCookieHeaderFn();
			const response = await apiClient(baseUrl, headersList).auth[
				"sign-out"
			].$get({
				query: {
					redirectUrl: window.location.href,
				},
			});

			if (response.status !== 200) {
				const error = await response.json();
				throw new Error(error.message);
			}

			return response.json();
		},
		onSuccess: (data) => {
			if (data.shouldRedirect) {
				onSuccess?.();
				toast.success("Signed out successfully!");
				router.push(data.redirectUrl);
			} else {
				toast.error("Uh oh! Something went wrong.", {
					description: "Failed to sign out",
				});
			}
		},
		onError: (error) => {
			console.error(error);
			toast.error("Uh oh! Something went wrong.", {
				description: error.message,
			});
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
