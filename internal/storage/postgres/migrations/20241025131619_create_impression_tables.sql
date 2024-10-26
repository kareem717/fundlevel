-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    round_impressions (
        round_id INT NOT NULL REFERENCES rounds (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (round_id, account_id, created_at)
    );

CREATE TABLE
    venture_impressions (
        venture_id INT NOT NULL REFERENCES ventures (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (venture_id, account_id, created_at)
    );

CREATE TABLE
    business_impressions (
        business_id INT NOT NULL REFERENCES businesses (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (business_id, account_id, created_at)
    );

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE round_impressions;

DROP TABLE venture_impressions;

DROP TABLE business_impressions;

-- +goose StatementEnd