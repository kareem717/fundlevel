import { getSessionFn } from "@fundlevel/web/app/actions/auth";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { createServerORPCClient } from "@fundlevel/web/lib/orpc/server";
import { ORPCError } from "@orpc/client";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const getStatementFn = cache(async (id: string) => {
	const idNumber = Number(id);
	if (isNaN(idNumber)) {
		throw notFound();
	}

	const orpc = await createServerORPCClient();
	try {
		const { statement } = await orpc.bankStatement.get.call({
			params: { id: idNumber },
		});
		return statement;
	} catch (e) {
		if (e instanceof ORPCError) {
			if (e.status === 404) {
				throw notFound();
			}
			throw new Error(e.message);
		}

		console.error(e);
		throw new Error("Failed to get bank statement", { cause: e });
	}
});

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	const statement = await getStatementFn(id);

	return {
		title: statement.originalFileName,
	};
};

export default async function BankStatementPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const statement = await getStatementFn(id);
	const session = await getSessionFn();

	if (!session) {
		redirect(redirects.auth.signIn);
	}

	return (
		<div>
			<h1>Bank Statement {id}</h1>
			<h1>Bank Statement {statement.originalFileName}</h1>
		</div>
	);
}
