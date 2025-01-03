-- +goose Up
-- +goose StatementBegin
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

-- +goose StatementEnd