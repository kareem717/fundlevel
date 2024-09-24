-- +goose Up
-- +goose StatementBegin
ALTER TABLE rounds
ADD COLUMN regular_dynamic_round_id INT REFERENCES regular_dynamic_rounds (id);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
ALTER TABLE rounds
DROP COLUMN regular_dynamic_round_id;

-- +goose StatementEnd