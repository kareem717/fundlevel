-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM(
    'awaiting_confirmation',
    'awaiting_payment',
    'payment_completed',
    'completed',
    'round_closed'
);

CREATE TABLE
    investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds,
        investor_id INT NOT NULL REFERENCES accounts,
        share_quantity INT NOT NULL CHECK (share_quantity>0),
        total_usd_cent_value BIGINT NOT NULL CHECK (total_usd_cent_value>0),
        status investment_status NOT NULL DEFAULT 'awaiting_confirmation',
        terms_id INT NOT NULL REFERENCES round_terms,
        terms_accepted_at timestamptz NOT NULL,
        terms_acceptance_ip_address VARCHAR(45) NOT NULL,
        terms_acceptance_user_agent VARCHAR(500),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX ON investments (round_id, investor_id, status)
WHERE
    deleted_at IS NULL
    AND status='awaiting_confirmation';

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