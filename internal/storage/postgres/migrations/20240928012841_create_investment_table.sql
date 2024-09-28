-- +goose Up
-- +goose StatementBegin
CREATE TYPE investment_status AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE
    round_investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_id INT NOT NULL REFERENCES accounts (id),
        amount BIGINT NOT NULL,
        status investment_status NOT NULL DEFAULT 'pending',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT amount_check CHECK (amount>0)
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