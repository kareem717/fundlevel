-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    round_terms (
        id serial PRIMARY KEY,
        CONTENT TEXT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_round_terms_updated_at BEFORE
UPDATE ON round_terms FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE TYPE round_status AS ENUM('active', 'successful', 'failed');

CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        business_id INT NOT NULL REFERENCES businesses,
        price_per_share_usd_cents BIGINT NOT NULL,
        total_business_shares INT NOT NULL,
        total_shares_for_sale INT NOT NULL,
        terms_id INT NOT NULL REFERENCES round_terms,
        status round_status NOT NULL,
        description VARCHAR(3000) NOT NULL,
        remaining_shares INT NOT NULL CHECK (remaining_shares>=0),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_rounds_updated_at BEFORE
UPDATE ON rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE rounds;

DROP TYPE round_status;

DROP TABLE round_terms;

-- +goose StatementEnd