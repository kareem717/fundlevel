CREATE TABLE
    plaid_transactions (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies (id) NOT NULL,
        bank_account_id TEXT REFERENCES plaid_bank_accounts,
        remote_id TEXT NOT NULL UNIQUE,
        CONTENT JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

COMMENT ON TABLE plaid_transactions IS 'Models https://plaid.com/docs/api/products/transactions/#transactionsget';

CREATE INDEX plaid_transactions_bank_account_id_idx ON plaid_transactions (bank_account_id);

CREATE TRIGGER plaid_transactions_updated_at_timestamp BEFORE
UPDATE ON plaid_transactions FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();