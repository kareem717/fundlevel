-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    dynamic_rounds (
        id serial PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        minimum_monetary_investment_value NUMERIC(15, 2) NOT NULL,
        ends_at timestamptz NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX dynamic_rounds_idx_round_id ON dynamic_rounds (round_id)
WHERE deleted_at IS NULL;

CREATE TRIGGER sync_dynamic_rounds_updated_at BEFORE
UPDATE ON dynamic_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE dynamic_rounds;

-- +goose StatementEnd