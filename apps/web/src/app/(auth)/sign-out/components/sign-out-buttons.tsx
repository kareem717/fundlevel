"use client";

import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { env } from "@fundlevel/web/env";
import { orpc } from "@fundlevel/web/lib/orpc/client";
import { ORPCError } from "@orpc/server";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentPropsWithRef } from "react";
import { toast } from "sonner";

interface SignOutButtonsProps extends ComponentPropsWithRef<"div"> {
	onSuccess?: () => void;
}

export function SignOutButtons({
	className,
	onSuccess,
	...props
}: SignOutButtonsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const redirectUrl = `${env.NEXT_PUBLIC_BASE_URL}${pathname}`;

	const { mutate: signOut, isPending } = useMutation(
		orpc.auth.signOut.mutationOptions({
			onSuccess: (data) => {
				if (data.shouldRedirect) {
					onSuccess?.();
					toast.success("Signed out successfully!");
					router.push(data.location);
				} else {
					toast.error("Uh oh! Something went wrong.", {
						description: "Failed to sign out",
					});
				}
			},
			onError: (error) => {
				if (error instanceof ORPCError) {
					console.log("error", JSON.stringify(error, null, 2));
				}
				console.error(error);
				toast.error("Uh oh! Something went wrong.", {
					description: error.message,
				});
			},
		}),
	);

	function handleSignOut() {
		signOut({
			query: {
				redirectUrl,
			},
		});
	}

	return (
		<div className={cn("grid grid-cols-2 gap-2", className)} {...props}>
			<Button onClick={() => router.back()} variant="secondary">
				Cancel
			</Button>
			<Button onClick={handleSignOut} disabled={isPending}>
				{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
				Logout
			</Button>
		</div>
	);
}
