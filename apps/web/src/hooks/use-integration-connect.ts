import { orpc } from "@fundlevel/web/lib/orpc/client";
import Nango, { type ConnectUI } from "@nangohq/frontend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useIntegrationConnect({
	onConnect,
	onClose,
}: {
	onConnect?: () => void;
	onClose?: () => void;
}) {
	const [connect, setConnect] = useState<ConnectUI | null>(null);
	const nango = new Nango();

	return useMutation(
		orpc.integration.sessionToken.mutationOptions({
			onMutate: () => {
				setConnect(
					nango.openConnectUI({
						onEvent: (event) => {
							if (event.type === "close") {
								onClose?.();
							} else if (event.type === "connect") {
								console.log(event.payload);
								onConnect?.();
							}
						},
					}),
				);
			},
			onSuccess: (data) => {
				if ("sessionToken" in data) {
					connect?.setSessionToken(data.sessionToken);
				} else {
					throw new Error("No session token found");
				}
			},
			onError: (error) => {
				console.error("Error connecting to Nango", error);
				toast.error(error.message);
				connect?.close();
			},
		}),
	);
}
