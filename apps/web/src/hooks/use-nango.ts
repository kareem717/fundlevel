import Nango from "@nangohq/frontend";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function useNango({
	onConnect,
	onClose,
}: {
	onConnect?: () => void;
	onClose?: () => void;
}) {
	const queryOptions = orpc.nango["session-token"].queryOptions({
		initialData: "",
		input: {
			integration: "quickbooks",
		},
	});
	const { data: sessionToken } = useQuery(queryOptions);

	const nango = new Nango();

	function connect() {
		const connect = nango.openConnectUI({
			onEvent: (event) => {
				if (event.type === "close") {
					onClose?.();
				} else if (event.type === "connect") {
					console.log(event.payload);
					onConnect?.();
				}
			},
		});

		connect.setSessionToken(sessionToken); // A loading indicator is shown until this is set.
	}

	return {
		connect,
	};
}
