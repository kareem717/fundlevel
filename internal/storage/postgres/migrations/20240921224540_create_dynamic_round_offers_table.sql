-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    dynamic_round_offers (
        dynamic_round_id INT NOT NULL REFERENCES dynamic_rounds (id),
        offer_id INT NOT NULL REFERENCES offers (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        PRIMARY KEY (dynamic_round_id, offer_id)
    );

CREATE TRIGGER sync_dynamic_round_offers_updated_at BEFORE
UPDATE ON dynamic_round_offers FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE dynamic_round_offers;

-- +goose StatementEnd