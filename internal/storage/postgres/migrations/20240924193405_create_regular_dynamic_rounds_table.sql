-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    regular_dynamic_rounds (
        id serial PRIMARY KEY,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_regular_dynamic_rounds_updated_at BEFORE
UPDATE ON regular_dynamic_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE regular_dynamic_rounds;

-- +goose StatementEnd