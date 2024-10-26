-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    chats (
        id serial PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE TRIGGER sync_chats_updated_at BEFORE
UPDATE ON chats FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

CREATE TABLE
    account_chats (
        account_id INT NOT NULL REFERENCES accounts (id),
        chat_id INT NOT NULL REFERENCES chats (id),
        PRIMARY KEY (account_id, chat_id)
    );

CREATE TABLE
    chat_messages (
        id serial PRIMARY KEY,
        sender_account_id INT NOT NULL REFERENCES accounts (id),
        chat_id INT NOT NULL REFERENCES chats (id),
        CONTENT TEXT NOT NULL,
        read_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

CREATE INDEX chat_messages_chat_id_created_at_idx ON chat_messages (chat_id, created_at)
WHERE
    deleted_at IS NULL;

CREATE TRIGGER sync_chat_messages_updated_at BEFORE
UPDATE ON chat_messages FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE chat_messages;

DROP TABLE account_chats;

DROP TABLE chats;

-- +goose StatementEnd