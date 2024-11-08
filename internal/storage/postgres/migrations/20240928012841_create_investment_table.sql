-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'pending',
    'processing',
    'rejected',
    'withdrawn',
    'successful',
    'round_closed'
);

CREATE TABLE
    round_investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_id INT NOT NULL REFERENCES accounts (id),
        status investment_status NOT NULL DEFAULT 'pending',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_round_investments_updated_at BEFORE
UPDATE ON round_investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE TYPE payment_status AS ENUM(
    'cancelled',
    'processing',
    'requires_action',
    'requires_capture',
    'requires_confirmation',
    'requires_payment_method',
    'succeeded'
);

CREATE TABLE
    round_investment_payments (
        round_investment_id INT NOT NULL REFERENCES round_investments (id) PRIMARY KEY,
        stripe_payment_intent_id TEXT NOT NULL,
        stripe_payment_intent_client_secret TEXT NOT NULL,
        status payment_status DEFAULT 'processing',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX ON round_investment_payments (stripe_payment_intent_id)
WHERE
    deleted_at IS NULL;

CREATE TRIGGER sync_round_investment_payments_updated_at BEFORE
UPDATE ON round_investment_payments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE round_investment_payments;

DROP TYPE payment_status;

DROP TABLE round_investments;

DROP TYPE investment_status;

-- +goose StatementEnd