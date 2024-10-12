-- +goose Up
-- +goose StatementBegin
CREATE TYPE business_status AS ENUM('pending', 'active', 'disabled');

CREATE TABLE
    businesses (
        id SERIAL PRIMARY KEY,
        NAME VARCHAR(200) NOT NULL,
        business_number VARCHAR(50) NOT NULL,
        founding_date DATE NOT NULL,
        owner_account_id INT NOT NULL REFERENCES accounts (id),
        status business_status NOT NULL DEFAULT 'pending',
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_businesses_updated_at BEFORE
UPDATE ON businesses FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE FUNCTION sync_updated_at_column_no_deleted_at () RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CLOCK_TIMESTAMP();
    RETURN NEW;
END;
$$;

CREATE TYPE business_member_role AS ENUM('admin', 'member');

CREATE TABLE
    business_members (
        business_id INT NOT NULL REFERENCES businesses (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        ROLE business_member_role NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        PRIMARY KEY (business_id, account_id),
        UNIQUE (business_id, ROLE)
    );

CREATE TRIGGER sync_business_members_updated_at BEFORE
UPDATE ON business_members FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column_no_deleted_at ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_members;

DROP TYPE business_member_role;

DROP FUNCTION sync_updated_at_column_no_deleted_at;

DROP TABLE businesses;

DROP TYPE business_status;

-- +goose StatementEnd