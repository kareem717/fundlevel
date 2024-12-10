-- +goose Up
-- +goose StatementBegin
CREATE TYPE stripe_payment_intent_status AS ENUM(
    'canceled',
    'processing',
    'requires_action',
    'requires_capture',
    'requires_confirmation',
    'requires_payment_method',
    'succeeded'
);

CREATE TABLE
    investment_payments (
        id SERIAL PRIMARY KEY,
        investment_id INT NOT NULL REFERENCES investments (id),
        stripe_payment_intent_id TEXT NOT NULL,
        stripe_payment_intent_client_secret TEXT NOT NULL,
        status stripe_payment_intent_status DEFAULT 'processing',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_investment_payments_updated_at BEFORE
UPDATE ON investment_payments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE UNIQUE INDEX ON investment_payments (investment_id, stripe_payment_intent_id)
WHERE
    deleted_at IS NULL
    AND status='processing';

CREATE UNIQUE INDEX ON investment_payments (investment_id, stripe_payment_intent_id)
WHERE
    deleted_at IS NULL
    AND status='succeeded';

CREATE UNIQUE INDEX ON investment_payments (stripe_payment_intent_id)
WHERE
    deleted_at IS NULL;

CREATE UNIQUE INDEX ON investment_payments (investment_id)
WHERE
    deleted_at IS NULL;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE investment_payments;

DROP TYPE stripe_payment_intent_status;

-- +goose StatementEnd