-- +goose Up
-- +goose StatementBegin
CREATE TYPE business_member_role AS ENUM('owner', 'admin', 'member');

CREATE TABLE
    business_member_roles (
        id SERIAL PRIMARY KEY,
        NAME business_member_role NOT NULL UNIQUE,
        description TEXT NOT NULL
    );

CREATE INDEX ON business_member_roles (NAME);

INSERT INTO
    business_member_roles (id, NAME, description)
VALUES
    (1, 'owner', 'Owner of the business');

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE business_member_roles;

DROP TYPE business_member_role;

-- +goose StatementEnd