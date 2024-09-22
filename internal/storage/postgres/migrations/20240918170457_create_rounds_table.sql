-- +goose Up
-- +goose StatementBegin
CREATE TYPE currency AS ENUM('usd', 'gbp', 'eur', 'cad', 'aud', 'jpy');

CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        offered_percentage NUMERIC(6, 3) NOT NULL,
        monetary_percentage_value NUMERIC(15, 2) NOT NULL,
        monetary_value_currency currency NOT NULL,
        venture_id INT NOT NULL REFERENCES ventures (id),
        begins_at timestamptz NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT offered_percentage_check CHECK (offered_percentage>0),
        CONSTRAINT monetary_percentage_value_check CHECK (monetary_percentage_value>0),
        CONSTRAINT begins_at_check CHECK (begins_at>created_at)
    );

COMMENT ON COLUMN rounds.offered_percentage IS 'Percentage of the venture offered in the round';
COMMENT ON COLUMN rounds.monetary_percentage_value IS 'Monetary value of the percentage offered';

CREATE TRIGGER sync_rounds_updated_at BEFORE
UPDATE ON rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE rounds;

DROP TYPE currency;

-- +goose StatementEnd