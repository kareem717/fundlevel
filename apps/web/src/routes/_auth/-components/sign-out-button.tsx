import { Button } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client"; //import the auth client

interface SignOutButtonProps extends ComponentPropsWithRef<typeof Button> {
	onSuccess?: () => void;
}

export function SignOutButton({
	className,
	onSuccess,
	...props
}: SignOutButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleLogout() {
		setIsLoading(true);
		const { data, error } = await authClient.signOut({
			fetchOptions: {
				onError: (error) => {
					console.error(error);
				},
			},
		});

		if (error) {
			console.error(error);
		}

		if (data?.success) {
			onSuccess?.();
		} else {
			//TODO: add sentry error
			toast.error("Failed to sign out");
		}

		setIsLoading(false);
	}

	return (
		<Button
			onClick={handleLogout}
			className={cn(className)}
			disabled={isLoading}
			{...props}
		>
			{isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
			Logout
		</Button>
	);
}
