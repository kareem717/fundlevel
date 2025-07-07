import Nango, { type ConnectUI } from "@nangohq/frontend";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useBindings } from "@/components/providers/bindings-provider";
import { apiClient } from "@/lib/api-client";

export function useNango({
	onConnect,
	onClose,
}: {
	onConnect?: () => void;
	onClose?: () => void;
}) {
	const env = useBindings();
	const [connect, setConnect] = useState<ConnectUI | null>(null);
	const nango = new Nango();

	return useMutation({
		mutationFn: async () => {
			const resp = await apiClient(env.NEXT_PUBLIC_SERVER_URL).nango[
				"session-token"
			].$post();
			if (!resp.ok) {
				throw new Error(await resp.text());
			}

			return await resp.json();
		},
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
	});
}
