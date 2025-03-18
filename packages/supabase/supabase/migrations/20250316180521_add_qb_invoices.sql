CREATE TABLE
    quick_books_invoices (
        id SERIAL PRIMARY KEY NOT NULL,
        company_id INT REFERENCES companies (id) NOT NULL,
        remote_id TEXT NOT NULL UNIQUE,
        CONTENT JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TRIGGER quick_books_invoices_updated_at_timestamp BEFORE
UPDATE ON quick_books_invoices FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();