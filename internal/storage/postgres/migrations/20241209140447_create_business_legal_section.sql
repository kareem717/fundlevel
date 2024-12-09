-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    business_legal_section (
        id serial PRIMARY KEY,
        business_number TEXT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE UNIQUE INDEX business_legal_section_business_number_idx ON business_legal_section (business_number)
WHERE
    deleted_at IS NULL;

CREATE TRIGGER sync_business_legal_section_updated_at BEFORE
UPDATE ON business_legal_section FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

ALTER TABLE businesses
ADD COLUMN business_legal_section_id INT REFERENCES business_legal_section (id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE businesses
DROP COLUMN business_legal_section_id;

DROP TABLE business_legal_section;

-- +goose StatementEnd