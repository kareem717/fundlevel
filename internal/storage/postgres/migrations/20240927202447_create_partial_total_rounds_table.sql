-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    partial_total_rounds (
        round_id INT NOT NULL REFERENCES rounds (id),
        investor_count INT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT check_investor_count CHECK (investor_count>0),
        PRIMARY KEY (round_id, created_at)
    );

CREATE TRIGGER sync_partial_total_rounds_updated_at BEFORE
UPDATE ON partial_total_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE partial_total_rounds;

-- +goose StatementEnd