import type { NangoRecord } from "@nangohq/node";
import * as Sentry from "@sentry/bun";
import { createNangoClient } from "./client";
import type { QuickbooksAccount } from "./types";

export const getQuickbookAccounts = async (
	connectionId: string,
	providerConfigKey: string,
) => {
	const nangoClient = createNangoClient();
	let accounts: NangoRecord<QuickbooksAccount>[] = [];

	let cursor: string | null = null;
	let page = 0;
	while (true) {
		page++;
		const { records, next_cursor } = await Sentry.startSpan(
			{
				name: "Nango API Call",
				op: "nango.api.listRecords",
				attributes: {
					providerConfigKey,
					model: "Account",
					page: page,
				},
			},
			async () => {
				const apiCallStartTime = performance.now();
				const result = await nangoClient.listRecords<QuickbooksAccount>({
					providerConfigKey,
					connectionId: connectionId,
					model: "Account",
					cursor: cursor,
				});
				const span = Sentry.getActiveSpan();
				if (span) {
					span.setAttribute(
						"nango.api.processing_time_ms",
						performance.now() - apiCallStartTime,
					);
					span.setAttribute("nango.api.records_found", result.records.length);
				}
				return result;
			},
		);

		accounts = accounts.concat(records);
		cursor = next_cursor;
		if (!cursor) {
			break;
		}
	}

	return accounts;
};
