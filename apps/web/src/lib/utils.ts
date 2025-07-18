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

/**
 * Format a date string into a human-readable format
 */
export function formatDate(
	dateString: string,
	options?: {
		includeTime?: boolean;
	},
): string {
	if (!dateString) return "Unknown";

	const date = new Date(dateString);

	if (options?.includeTime) {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	}

	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Format bytes into a human-readable string
 */
export function formatBytes(bytes: string | number): string {
	const numBytes = typeof bytes === "string" ? Number.parseInt(bytes) : bytes;
	if (!numBytes || numBytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(numBytes) / Math.log(k));

	return `${Number.parseFloat((numBytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format currency from cents to a formatted string
 */
export function formatCurrency(amountCents: number, currency = "USD"): string {
	const amount = amountCents / 100;
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
		minimumFractionDigits: 2,
	}).format(amount);
}

/**
 * Get CSS classes for file type badges based on file type
 */
export function getFileTypeColor(type: string): string {
	switch (type.toLowerCase()) {
		case "pdf":
			return "bg-red-100 text-red-700 border-red-200";
		case "xlsx":
		case "xls":
			return "bg-green-100 text-green-700 border-green-200";
		case "csv":
			return "bg-blue-100 text-blue-700 border-blue-200";
		default:
			return "bg-gray-100 text-gray-700 border-gray-200";
	}
}

/**
 * Get display name for file type from MIME type
 */
export function getFileTypeDisplay(fileType: string): string {
	const [_, subtype] = fileType.split("/");
	return subtype.toUpperCase();
}
