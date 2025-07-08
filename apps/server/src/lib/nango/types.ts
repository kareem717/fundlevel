export const NangoIntegration = {
	QUICKBOOKS: "quickbooks",
	GOOGLE_SHEETS: "google-sheet",
} as const;

export type QuickbooksAccount = {
	created_at: string;
	updated_at: string;
	id: string;
	fully_qualified_name: string;
	name: string;
	account_type: string;
	account_sub_type: string;
	classification: string;
	current_balance_cents: number;
	active: boolean;
	description: string | null;
	acct_num: string | null;
	sub_account: boolean;
	_nango_metadata: {
		deleted_at: Date | null;
		last_action: "ADDED" | "UPDATED" | "DELETED";
		first_seen_at: Date;
		cursor: string;
		last_modified_at: Date;
	};
};
