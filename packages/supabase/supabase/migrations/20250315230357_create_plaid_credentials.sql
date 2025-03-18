CREATE TABLE
    plaid_credentials (
        company_id INT REFERENCES companies (id) NOT NULL PRIMARY KEY,
        access_token TEXT NOT NULL,
        item_id TEXT NOT NULL,
        transaction_cursor TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER plaid_credentials_updated_at_timestamp BEFORE
UPDATE ON plaid_credentials FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();