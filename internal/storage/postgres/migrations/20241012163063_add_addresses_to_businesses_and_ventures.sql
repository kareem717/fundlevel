-- +goose Up
-- +goose StatementBegin
ALTER TABLE ventures
ADD COLUMN address_id INTEGER NOT NULL REFERENCES addresses (id);

ALTER TABLE businesses
ADD COLUMN address_id INTEGER NOT NULL REFERENCES addresses (id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE ventures
DROP COLUMN address_id;

ALTER TABLE businesses
DROP COLUMN address_id;

-- +goose StatementEnd