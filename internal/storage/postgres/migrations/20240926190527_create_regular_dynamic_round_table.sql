-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    regular_dynamic_rounds (
        round_id INT NOT NULL REFERENCES rounds (id),
        days_extend_on_bid INT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        PRIMARY KEY (round_id, created_at)
    );

CREATE TRIGGER sync_regular_dynamic_rounds_updated_at BEFORE
UPDATE ON regular_dynamic_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE regular_dynamic_rounds;

-- +goose StatementEnd