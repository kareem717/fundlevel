CREATE TABLE
    plaid_transactions (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies (id) NOT NULL,
        plaid_transaction_id TEXT UNIQUE NOT NULL,
        plaid_category_id TEXT,
        category TEXT,
        TYPE TEXT NOT NULL,
        NAME TEXT NOT NULL,
        amount NUMERIC(28, 10) NOT NULL,
        iso_currency_code TEXT,
        unofficial_currency_code TEXT,
        date date NOT NULL,
        pending BOOLEAN NOT NULL,
        account_owner TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER plaid_transactions_updated_at_timestamp BEFORE
UPDATE ON plaid_transactions FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();