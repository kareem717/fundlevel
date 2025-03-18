CREATE TABLE
    quick_books_oauth_credentials (
        company_id serial PRIMARY KEY NOT NULL REFERENCES companies,
        realm_id TEXT NOT NULL,
        access_token TEXT NOT NULL,
        access_token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
        refresh_token TEXT NOT NULL,
        refresh_token_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );

CREATE TABLE
    quick_books_oauth_states (
        company_id serial NOT NULL PRIMARY KEY REFERENCES companies,
        state UUID NOT NULL,
        redirect_url TEXT NOT NULL,
        auth_url TEXT NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    );