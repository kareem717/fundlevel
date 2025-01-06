-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    round_favourites (
        round_id INT NOT NULL REFERENCES rounds (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX round_favourites_idx ON round_favourites (round_id, account_id, deleted_at)
WHERE
    deleted_at IS NULL;

CREATE TABLE
    business_favourites (
        business_id INT NOT NULL REFERENCES businesses (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX business_favourites_idx ON business_favourites (business_id, account_id, deleted_at)
WHERE
    deleted_at IS NULL;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE round_favourites;

DROP TABLE business_favourites;

-- +goose StatementEnd