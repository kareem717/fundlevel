-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    industries (
        id serial PRIMARY KEY,
        LABEL VARCHAR(30) NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_industries_updated_at BEFORE
UPDATE ON industries FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE industries;

-- +goose StatementEnd