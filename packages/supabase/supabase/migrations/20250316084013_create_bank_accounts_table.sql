CREATE TABLE
    plaid_bank_accounts (
        id SERIAL PRIMARY KEY NOT NULL,
        company_id INT REFERENCES companies (id) NOT NULL,
        remote_id TEXT NOT NULL UNIQUE,
        CONTENT JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER plaid_bank_accounts_updated_at_timestamp BEFORE
UPDATE ON plaid_bank_accounts FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();