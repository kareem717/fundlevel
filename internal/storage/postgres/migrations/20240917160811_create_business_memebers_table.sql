-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    business_member_roles (
        id serial PRIMARY KEY,
        NAME TEXT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_business_member_roles_updated_at BEFORE
UPDATE ON business_member_roles FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE TYPE role_permission_value AS ENUM('full_access');

CREATE TABLE
    business_member_role_permissions (
        role_id INT NOT NULL REFERENCES business_member_roles (id),
        VALUE role_permission_value NOT NULL,
        PRIMARY KEY (role_id, VALUE)
    );

CREATE TABLE
    business_members (
        business_id INT NOT NULL REFERENCES businesses (id),
        account_id INT NOT NULL REFERENCES accounts (id),
        role_id INT NOT NULL REFERENCES business_member_roles (id),
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        PRIMARY KEY (business_id, account_id)
    );

CREATE TRIGGER sync_business_members_updated_at BEFORE
UPDATE ON business_members FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_members;

DROP TABLE business_member_role_permissions;

DROP TYPE role_permission_value;

DROP TABLE business_member_roles;

-- +goose StatementEnd