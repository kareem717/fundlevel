-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    business_stripe_accounts (
        business_id INT PRIMARY KEY REFERENCES businesses (id),
        stripe_transfers_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        stripe_disabled_reason TEXT,
        stripe_connected_account_id TEXT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_business_stripe_accounts_updated_at BEFORE
UPDATE ON business_stripe_accounts FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_stripe_accounts;

-- +goose StatementEnd