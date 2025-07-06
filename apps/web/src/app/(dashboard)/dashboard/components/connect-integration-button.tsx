"use client";
import { Button } from "@fundlevel/ui/components/button";
import { Loader2 } from "lucide-react";
import { useNango } from "@/hooks/use-nango";

export function ConnectIntegrationButton() {
	const { mutate, isPending } = useNango({
		onConnect: () => {
			console.log("connected");
		},
		onClose: () => {
			console.log("closed");
		},
	});

	return (
		<Button onClick={() => mutate()} disabled={isPending}>
			{isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
			Connect
		</Button>
	);
}
