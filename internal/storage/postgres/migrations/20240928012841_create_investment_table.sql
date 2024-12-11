-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'awaiting_term_acceptance',
    'awaiting_approval',
    'awaiting_payment',
    'investor_tasks_completed',
    'failed_to_accept_terms',
    'failed_to_make_payment',
    'investor_withdrew',
    'business_rejected',
    'round_closed_before_investor_tasks_completed'
);

-- Could add checks to ensure that the stuatuses are valid,
-- i.e. if status = 'awaiting_payment' then approved_at must be null
CREATE TABLE
    investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_id INT NOT NULL REFERENCES accounts (id),
        status investment_status NOT NULL DEFAULT 'awaiting_term_acceptance',
        amount_usd_cents BIGINT NOT NULL CHECK (amount_usd_cents>99),
        requires_manual_approval BOOLEAN NOT NULL DEFAULT FALSE,
        approved_at timestamptz,
        terms_completed_at timestamptz,
        payment_completed_at timestamptz,
        completed_at timestamptz,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_investments_updated_at BEFORE
UPDATE ON investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE investments;

DROP TYPE investment_status;

-- +goose StatementEnd