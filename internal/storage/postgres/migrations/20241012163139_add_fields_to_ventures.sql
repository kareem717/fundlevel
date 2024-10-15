-- +goose Up
-- +goose StatementBegin
ALTER TABLE ventures
ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TYPE team_size AS ENUM(
    '0-1',
    '2-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
);

ALTER TABLE ventures
ADD COLUMN team_size team_size;

ALTER TABLE ventures
ADD COLUMN is_remote BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE ventures
ADD COLUMN address_id INTEGER REFERENCES addresses (id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE ventures
DROP COLUMN address_id;

ALTER TABLE ventures
DROP COLUMN is_remote;

ALTER TABLE ventures
DROP COLUMN team_size;

DROP TYPE team_size;

ALTER TABLE ventures
DROP COLUMN is_hidden;

-- +goose StatementEnd