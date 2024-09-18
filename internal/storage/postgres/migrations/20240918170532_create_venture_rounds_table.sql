-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    venture_rounds (
        id serial PRIMARY KEY,
        
        venture_id INT NOT NULL,
        round_id INT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_venture_round_updated_at BEFORE
UPDATE ON venture_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE venture_rounds;

-- +goose StatementEnd