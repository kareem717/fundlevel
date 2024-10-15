-- +goose Up
-- +goose StatementBegin
CREATE TYPE currency AS ENUM('USD', 'GBP', 'EUR', 'CAD', 'AUD', 'JPY');

CREATE TYPE round_status AS ENUM('active', 'successful', 'failed');

CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        venture_id INT NOT NULL REFERENCES ventures (id),
        begins_at timestamptz NOT NULL,
        ends_at timestamptz NOT NULL,
        percentage_offered NUMERIC(6, 3) NOT NULL,
        percentage_value BIGINT NOT NULL,
        value_currency currency NOT NULL,
        status round_status NOT NULL,
        investor_count INT NOT NULL,
        buy_in NUMERIC(15, 2) NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT percentage_offered_check CHECK (percentage_offered>0),
        CONSTRAINT percentage_value_check CHECK (percentage_value>0),
        CONSTRAINT ends_at_check CHECK (ends_at>begins_at),
        CONSTRAINT begins_at_check CHECK (begins_at>created_at),
        CONSTRAINT investor_count_check CHECK (investor_count>0)
    );

CREATE TRIGGER sync_rounds_updated_at BEFORE
UPDATE ON rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE rounds;

DROP TYPE round_status;

DROP TYPE currency;

-- +goose StatementEnd