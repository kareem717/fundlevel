-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'awaiting_payment',
    'payment_completed',
    'completed'
);

CREATE TABLE
    investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds,
        investor_id INT NOT NULL REFERENCES accounts,
        share_quantity INT NOT NULL CHECK (share_quantity>0),
        terms_acceptance_id INT NOT NULL REFERENCES round_terms_acceptances,
        status investment_status NOT NULL DEFAULT 'awaiting_payment',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_investments_updated_at BEFORE
UPDATE ON investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE INDEX ON investments (status)
WHERE
    deleted_at IS NULL
    AND status NOT IN ('payment_completed', 'completed');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE investments;

DROP TYPE investment_status;

-- +goose StatementEnd