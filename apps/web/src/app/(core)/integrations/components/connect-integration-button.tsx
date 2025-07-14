"use client";

import type { NangoProviders } from "@fundlevel/db/types";
import { Button } from "@fundlevel/ui/components/button";
import { useIntegrationConnect } from "@fundlevel/web/hooks/use-integration-connect";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

interface ConnectIntegrationButtonProps
	extends ComponentPropsWithoutRef<typeof Button> {
	integration: NangoProviders;
}

export function ConnectIntegrationButton({
	integration,
	children,
	...props
}: ConnectIntegrationButtonProps) {
	const { mutate, isPending } = useIntegrationConnect({
		onConnect: () => {
			console.log("connected");
		},
		onClose: () => {
			console.log("closed");
		},
	});

	return (
		<Button
			onClick={() => mutate({ integration })}
			disabled={isPending}
			{...props}
		>
			{isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
			{children ? children : `Connect ${integration}`}
		</Button>
	);
}
