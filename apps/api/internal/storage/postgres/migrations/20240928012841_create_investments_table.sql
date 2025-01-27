-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    investments (
        id SERIAL PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds,
        investor_id INT NOT NULL REFERENCES accounts,
        share_quantity INT NOT NULL CHECK (share_quantity>0),
        terms_acceptance_id INT NOT NULL REFERENCES round_terms_acceptances,
        usd_cent_value BIGINT NOT NULL,
        completed_at timestamptz,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_investments_updated_at BEFORE
UPDATE ON investments FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE INDEX ON investments (completed_at)
WHERE
    deleted_at IS NULL
    AND completed_at IS NOT NULL;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE investments;

-- +goose StatementEnd