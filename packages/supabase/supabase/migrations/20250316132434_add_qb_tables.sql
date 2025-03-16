CREATE TABLE
    quick_books_oauth_credentials (
        linked_account_id serial PRIMARY KEY NOT NULL REFERENCES linked_accounts,
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
        linked_account_id serial NOT NULL PRIMARY KEY REFERENCES linked_accounts,
        state UUID NOT NULL,
        redirect_url TEXT NOT NULL,
        auth_url TEXT NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    );