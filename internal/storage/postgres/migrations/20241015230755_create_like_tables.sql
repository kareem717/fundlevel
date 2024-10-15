-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    venture_likes (
        venture_id INT NOT NULL REFERENCES ventures (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (venture_id, account_id)
    );

CREATE TABLE
    round_likes (
        round_id INT NOT NULL REFERENCES rounds (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (round_id, account_id)
    );

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE venture_likes;

DROP TABLE round_likes;

-- +goose StatementEnd