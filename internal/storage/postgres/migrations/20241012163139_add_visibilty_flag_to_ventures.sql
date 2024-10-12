-- +goose Up
-- +goose StatementBegin
ALTER TABLE ventures
ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE ventures
DROP COLUMN address_id;

ALTER TABLE ventures
DROP COLUMN is_hidden;

-- +goose StatementEnd