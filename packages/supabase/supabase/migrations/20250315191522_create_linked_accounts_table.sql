CREATE TABLE
    linked_accounts (
        id serial PRIMARY KEY NOT NULL,
        owner_id INT REFERENCES accounts (id) NOT NULL,
        NAME VARCHAR(120) NOT NULL,
        merge_dev_account_token text NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    )