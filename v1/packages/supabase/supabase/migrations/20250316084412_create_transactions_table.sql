CREATE TYPE plaid_transaction_payment_channel AS ENUM('online', 'in store', 'other');

CREATE TYPE plaid_confidence_level AS ENUM('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');

CREATE TYPE plaid_transaction_code AS ENUM(
    'adjustment',
    'atm',
    'bank charge',
    'bill payment',
    'cash',
    'cashback',
    'cheque',
    'direct debit',
    'interest',
    'purchase',
    'standing order',
    'transfer',
    'null'
);

CREATE TABLE
    plaid_transactions (
        remote_id TEXT NOT NULL PRIMARY KEY,
        company_id INTEGER REFERENCES companies (id) NOT NULL,
        bank_account_id TEXT NOT NULL,
        iso_currency_code VARCHAR(3),
        unofficial_currency_code VARCHAR(3),
        check_number TEXT,
        date DATE NOT NULL,
        datetime TIMESTAMP WITH TIME ZONE,
        NAME TEXT NOT NULL,
        merchant_name TEXT,
        original_description TEXT,
        pending BOOLEAN NOT NULL,
        website TEXT,
        authorized_at TIMESTAMP WITH TIME ZONE,
        payment_channel plaid_transaction_payment_channel NOT NULL,
        amount DOUBLE PRECISION NOT NULL,
        personal_finance_category_primary TEXT,
        personal_finance_category_detailed TEXT,
        personal_finance_category_confidence_level plaid_confidence_level,
        code plaid_transaction_code,
        remaining_remote_content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE,
        CHECK (
            (
                personal_finance_category_primary IS NULL
                AND personal_finance_category_detailed IS NULL
            )
            OR (
                personal_finance_category_primary IS NOT NULL
                AND personal_finance_category_detailed IS NOT NULL
            )
        )
    );

COMMENT ON TABLE plaid_transactions IS 'Models https://plaid.com/docs/api/products/transactions/#transactionsget';

CREATE INDEX plaid_transactions_bank_account_id_idx ON plaid_transactions (bank_account_id);

CREATE TRIGGER plaid_transactions_updated_at_timestamp BEFORE
UPDATE ON plaid_transactions FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();