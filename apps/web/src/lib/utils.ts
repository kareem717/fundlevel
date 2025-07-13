import type { NangoProviders } from "@fundlevel/db/types";

export function getIntegrationProviderMetadata(provider: NangoProviders): {
	description: string;
	category: string;
} {
	switch (provider) {
		case "QuickBooks":
			return {
				description:
					"QuickBooks is a cloud-based accounting software that helps businesses manage their finances and accounting tasks.",
				category: "Accounting",
			};
		case "Google Sheets":
			return {
				description:
					"Google Sheets is a cloud-based spreadsheet software that helps businesses manage their finances and accounting tasks.",
				category: "Data",
			};
	}
}
