-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'pending',
    'accepted',
    'rejected',
    'withdrawn',
    'successful',
    'failed'
);

CREATE TABLE
    round_investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_id INT NOT NULL REFERENCES accounts (id),
        status investment_status NOT NULL DEFAULT 'pending',
        stripe_checkout_session_id TEXT,
        paid_at timestamptz,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT paid_at_check CHECK (
            (
                paid_at IS NULL
                AND stripe_checkout_session_id IS NULL
            )
            OR (
                paid_at IS NOT NULL
                AND stripe_checkout_session_id IS NOT NULL
            )
        )
        -- //TODO: add paid_at/signed_at and status checks: i.e. cant be accepted if those are null etc.
    );

CREATE TRIGGER sync_round_investments_updated_at BEFORE
UPDATE ON round_investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE round_investments;

DROP TYPE investment_status;

-- +goose StatementEnd