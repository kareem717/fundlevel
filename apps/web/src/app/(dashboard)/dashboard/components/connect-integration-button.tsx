"use client";

import { Button } from "@fundlevel/ui/components/button";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useNango } from "@/hooks/use-nango";

interface ConnectIntegrationButtonProps
	extends ComponentPropsWithoutRef<typeof Button> {
	integration: "quickbooks" | "google-sheet";
}

export function ConnectIntegrationButton({
	integration,
	children,
	...props
}: ConnectIntegrationButtonProps) {
	const { mutate, isPending } = useNango({
		onConnect: () => {
			console.log("connected");
		},
		onClose: () => {
			console.log("closed");
		},
	});

	return (
		<Button onClick={() => mutate(integration)} disabled={isPending} {...props}>
			{isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
			{children ? children : `Connect ${integration}`}
		</Button>
	);
}
