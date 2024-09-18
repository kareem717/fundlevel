-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    ventures (
        id serial PRIMARY KEY,
        NAME VARCHAR(50) NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_venture_updated_at BEFORE
UPDATE ON ventures FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE ventures;

-- +goose StatementEnd