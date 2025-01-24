-- +goose Up
-- +goose StatementBegin
-- stripe provides more than just the two statuses, but we only need to track these two
CREATE TYPE stripe_identity_status AS ENUM('verified', 'canceled');

CREATE TABLE
    stripe_identities (
        account_id INT NOT NULL REFERENCES accounts (id) PRIMARY KEY,
        remote_id TEXT NOT NULL,
        status stripe_identity_status NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz
    );

CREATE TRIGGER sync_stripe_identities_updated_at BEFORE
UPDATE ON stripe_identities FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE stripe_identities;

DROP TYPE stripe_identity_status;

-- +goose StatementEnd