-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    fixed_total_rounds (
        round_id INT NOT NULL REFERENCES rounds (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        PRIMARY KEY (round_id, created_at)
    );

CREATE TRIGGER sync_fixed_total_rounds_updated_at BEFORE
UPDATE ON fixed_total_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE fixed_total_rounds;

-- +goose StatementEnd