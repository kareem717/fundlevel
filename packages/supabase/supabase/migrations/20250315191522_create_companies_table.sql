CREATE TABLE
    companies (
        id serial PRIMARY KEY NOT NULL,
        owner_id INT REFERENCES accounts (id) NOT NULL,
        NAME TEXT NOT NULL,
        email VARCHAR(360) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER companies_updated_at_timestamp BEFORE
UPDATE ON companies FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();