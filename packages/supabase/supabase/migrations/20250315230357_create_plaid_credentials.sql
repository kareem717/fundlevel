CREATE TABLE
    linked_account_plaid_credentials (
        linked_account_id INT REFERENCES linked_accounts (id) NOT NULL PRIMARY KEY,
        access_token TEXT NOT NULL,
        item_id TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );