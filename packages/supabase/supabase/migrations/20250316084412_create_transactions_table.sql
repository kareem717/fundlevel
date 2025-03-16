CREATE TABLE
    plaid_transactions (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies (id) NOT NULL,
        remote_id TEXT NOT NULL UNIQUE,
        CONTENT JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER plaid_transactions_updated_at_timestamp BEFORE
UPDATE ON plaid_transactions FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();