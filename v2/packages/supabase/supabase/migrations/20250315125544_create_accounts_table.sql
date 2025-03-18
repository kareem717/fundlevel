CREATE
OR REPLACE FUNCTION trigger_set_timestamp () RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE
    accounts (
        id serial PRIMARY KEY NOT NULL,
        user_id UUID NOT NULL REFERENCES auth.users,
        email VARCHAR(360) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER accounts_updated_at_timestamp BEFORE
UPDATE ON accounts FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();