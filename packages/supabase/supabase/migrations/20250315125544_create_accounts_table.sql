CREATE TABLE
    accounts (
        id serial PRIMARY KEY NOT NULL,
        user_id UUID NOT NULL REFERENCES auth.users,
        email VARCHAR(360) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );