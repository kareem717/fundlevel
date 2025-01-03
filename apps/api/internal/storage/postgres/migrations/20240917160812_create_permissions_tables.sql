-- +goose Up
-- +goose StatementBegin
CREATE TYPE role_permission_value AS ENUM('full_access');

CREATE TABLE
    business_member_role_permissions (
        id SERIAL PRIMARY KEY,
        VALUE role_permission_value NOT NULL UNIQUE,
        description TEXT NOT NULL
    );

INSERT INTO
    business_member_role_permissions (id, VALUE, description)
VALUES
    (1, 'full_access', 'Full access to the business');

CREATE TABLE
    business_member_role_permission_assignments (
        role_id INT NOT NULL REFERENCES business_member_roles (id),
        permission_id INT NOT NULL REFERENCES business_member_role_permissions (id),
        PRIMARY KEY (role_id, permission_id)
    );

INSERT INTO
    business_member_role_permission_assignments (role_id, permission_id)
VALUES
    (1, 1);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_member_role_permission_assignments;

DROP TABLE business_member_role_permissions;

DROP TYPE role_permission_value;

-- +goose StatementEnd