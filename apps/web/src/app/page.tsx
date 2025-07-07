import { cookies } from "next/headers";
import { getSessionFn } from "./actions/auth";

export default async function HomePge() {
	const session = await getSessionFn();

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="container mx-auto max-w-3xl px-4 py-2">
				<pre className="w-full overflow-auto overflow-x-auto rounded-md bg-secondary p-2 font-mono text-sm">
					{JSON.stringify(session, null, 2)}
				</pre>
				<pre className="w-full overflow-auto overflow-x-auto rounded-md bg-secondary p-2 font-mono text-sm">
					{JSON.stringify(await cookies(), null, 2)}
				</pre>
			</div>
		</div>
	);
}
