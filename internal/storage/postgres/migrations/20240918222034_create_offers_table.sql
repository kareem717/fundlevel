-- +goose Up
-- +goose StatementBegin
CREATE TYPE offer_status AS ENUM('pending', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE
    offers (
        id serial PRIMARY KEY,
        round_id INT NOT NULL REFERENCES rounds (id),
        offerer_account_id INT NOT NULL REFERENCES accounts (id),
        percentage_amount NUMERIC(6, 3) NOT NULL,
        amount NUMERIC(15, 2) NOT NULL,
        currency currency NOT NULL,
        status offer_status NOT NULL DEFAULT 'pending',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_offers_updated_at BEFORE
UPDATE ON offers FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE offers;

DROP TYPE offer_status;

-- +goose StatementEnd