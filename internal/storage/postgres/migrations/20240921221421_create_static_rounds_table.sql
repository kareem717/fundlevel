-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    static_rounds (
        id serial PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        ends_at timestamptz,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT check_ends_at CHECK (ends_at > created_at OR ends_at IS NULL)
    );

CREATE UNIQUE INDEX static_rounds_idx_round_id ON static_rounds (round_id)
WHERE
    deleted_at IS NULL;

CREATE TRIGGER sync_static_rounds_updated_at BEFORE
UPDATE ON static_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE static_rounds;

-- +goose StatementEnd