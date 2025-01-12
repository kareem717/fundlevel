-- +goose Up
-- +goose StatementBegin
CREATE TYPE round_status AS ENUM('active', 'successful', 'failed');

CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        business_id INT NOT NULL REFERENCES businesses,
        price_per_share_usd_cents INT NOT NULL,
        total_business_shares INT NOT NULL,
        total_shares_for_sale INT NOT NULL,
        status round_status NOT NULL,
        description VARCHAR(3000) NOT NULL,
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

-- +goose StatementEnd