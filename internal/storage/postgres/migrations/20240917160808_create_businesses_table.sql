-- +goose Up
-- +goose StatementBegin
CREATE TYPE business_status AS ENUM('pending', 'active', 'disabled');

CREATE TYPE team_size AS ENUM(
    '1',
    '2-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
);

CREATE TABLE
    businesses (
        id SERIAL PRIMARY KEY,
        NAME VARCHAR(200) NOT NULL,
        business_number VARCHAR(50) NOT NULL,
        founding_date DATE NOT NULL,
        status business_status NOT NULL DEFAULT 'pending',
        team_size team_size NOT NULL DEFAULT '1',
        is_remote BOOLEAN NOT NULL DEFAULT FALSE,
        address_id INTEGER NOT NULL REFERENCES addresses (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TABLE
    business_industries (
        business_id INTEGER NOT NULL REFERENCES businesses (id),
        industry_id INTEGER NOT NULL REFERENCES industries (id),
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        PRIMARY KEY (business_id, industry_id)
    );

CREATE TRIGGER sync_businesses_updated_at BEFORE
UPDATE ON businesses FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_industries;

DROP TABLE businesses;

DROP TYPE team_size;

DROP TYPE business_status;

-- +goose StatementEnd