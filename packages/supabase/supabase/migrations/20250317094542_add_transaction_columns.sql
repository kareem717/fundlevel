-- Migration to add account_id as a generated column
ALTER TABLE plaid_transactions
ADD COLUMN account_id TEXT GENERATED ALWAYS AS (CONTENT->>'account_id') STORED;

-- Create an index on the new column for faster lookups
CREATE INDEX idx_plaid_transactions_account_id ON plaid_transactions (account_id);