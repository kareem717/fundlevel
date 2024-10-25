-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    venture_likes (
        venture_id INT NOT NULL REFERENCES ventures (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX venture_likes_idx ON venture_likes (venture_id, account_id, deleted_at)
WHERE
    deleted_at IS NULL;

CREATE TABLE
    round_likes (
        round_id INT NOT NULL REFERENCES rounds (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX round_likes_idx ON round_likes (round_id, account_id, deleted_at)
WHERE
    deleted_at IS NULL;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE venture_likes;

DROP TABLE round_likes;

-- +goose StatementEnd