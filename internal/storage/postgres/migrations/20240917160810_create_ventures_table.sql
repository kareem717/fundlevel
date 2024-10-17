-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    ventures (
        id serial PRIMARY KEY,
        NAME TEXT NOT NULL,
        description TEXT NOT NULL,
        business_id INTEGER NOT NULL REFERENCES businesses (id),
        is_hidden BOOLEAN NOT NULL,
        overview VARCHAR(30) NOT NULL,
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