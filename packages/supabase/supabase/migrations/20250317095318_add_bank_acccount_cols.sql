-- Migration to add account_id as a generated column to plaid_bank_accounts
ALTER TABLE plaid_bank_accounts
ADD COLUMN account_id TEXT GENERATED ALWAYS AS (CONTENT->>'account_id') STORED;

-- Create an index on the new column for faster lookups
CREATE INDEX idx_plaid_bank_accounts_account_id ON plaid_bank_accounts (account_id);