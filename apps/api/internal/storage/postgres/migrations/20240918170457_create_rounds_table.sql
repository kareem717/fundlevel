-- +goose Up
-- +goose StatementBegin
CREATE TYPE round_status AS ENUM('active', 'successful', 'failed');

CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        business_id INT NOT NULL REFERENCES businesses (id),
        begins_at timestamptz NOT NULL,
        ends_at timestamptz NOT NULL,
        percentage_selling NUMERIC(6, 3) NOT NULL,
        valuation_amount_usd_cents BIGINT NOT NULL,
        status round_status NOT NULL,
        investments_require_approval BOOLEAN NOT NULL DEFAULT FALSE,
        investor_count INT NOT NULL,
        description VARCHAR(3000) NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT percentage_selling_check CHECK (percentage_selling>0),
        CONSTRAINT valuation_amount_usd_cents_check CHECK (valuation_amount_usd_cents>99),
        CONSTRAINT ends_at_check CHECK (ends_at>begins_at),
        CONSTRAINT begins_at_check CHECK (begins_at>created_at),
        CONSTRAINT investor_count_check CHECK (investor_count>0),
        CONSTRAINT description_check CHECK (LENGTH(description)>=10)
    );

CREATE TRIGGER sync_rounds_updated_at BEFORE
UPDATE ON rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE rounds;

DROP TYPE round_status;

-- +goose StatementEnd