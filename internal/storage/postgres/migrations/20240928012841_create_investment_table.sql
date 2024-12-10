-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'awaiting_term_acceptance',
    'awaiting_payment',
    'investor_tasks_completed',
    'failed_to_accept_terms',
    'failed_to_make_payment',
    'investor_withdrew',
    'business_rejected',
    'round_closed_before_investor_tasks_completed'
);

CREATE TABLE
    investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_id INT NOT NULL REFERENCES accounts (id),
        status investment_status NOT NULL DEFAULT 'awaiting_term_acceptance',
        amount_usd_cents INT NOT NULL CHECK (amount_usd_cents>99),
        requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
        intent_completed_at timestamptz,
        payment_completed_at timestamptz,
        completed_at timestamptz,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_investments_updated_at BEFORE
UPDATE ON investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- CREATE TYPE payment_status AS ENUM(
--     'cancelled',
--     'processing',
--     'requires_action',
--     'requires_capture',
--     'requires_confirmation',
--     'requires_payment_method',
--     'succeeded'
-- );
-- CREATE TABLE
--     investment_payments (
--         investment_id INT NOT NULL REFERENCES investments (id) PRIMARY KEY,
--         stripe_payment_intent_id TEXT NOT NULL,
--         stripe_payment_intent_client_secret TEXT NOT NULL,
--         status payment_status DEFAULT 'processing',
--         created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
--         updated_at timestamptz,
--         deleted_at timestamptz
--     );
-- CREATE UNIQUE INDEX ON investment_payments (stripe_payment_intent_id)
-- WHERE
--     deleted_at IS NULL;
-- CREATE TRIGGER sync_investment_payments_updated_at BEFORE
-- UPDATE ON investment_payments FOR EACH ROW
-- EXECUTE PROCEDURE sync_updated_at_column ();
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
-- DROP TABLE investment_payments;
-- DROP TYPE payment_status;
DROP TABLE investment;

DROP TYPE investment_status;

-- +goose StatementEnd