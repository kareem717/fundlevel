-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    positions (
        id serial PRIMARY KEY,
        investment_id INT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_positions_updated_at BEFORE
UPDATE ON positions FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE positions;

-- +goose StatementEnd