-- +goose Up
-- +goose StatementBegin
ALTER TABLE ventures
DROP CONSTRAINT ventures_owner_account_id_fkey;

ALTER TABLE ventures
DROP COLUMN owner_account_id;

ALTER TABLE ventures
ADD COLUMN business_id INT NOT NULL REFERENCES businesses (id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE ventures
DROP CONSTRAINT ventures_business_id_fkey;

ALTER TABLE ventures
ADD COLUMN owner_account_id INT NOT NULL REFERENCES accounts (id);

-- +goose StatementEnd