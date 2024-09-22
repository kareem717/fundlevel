-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    static_round_offers (
        static_round_id INT NOT NULL REFERENCES static_rounds (id),
        offer_id INT NOT NULL REFERENCES offers (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        PRIMARY KEY (static_round_id, offer_id)
    );

CREATE TRIGGER sync_static_round_offers_updated_at BEFORE
UPDATE ON static_round_offers FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE static_round_offers;

-- +goose StatementEnd