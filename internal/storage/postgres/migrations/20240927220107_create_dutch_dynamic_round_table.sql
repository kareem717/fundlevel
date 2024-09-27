-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    dutch_dynamic_rounds (
        round_id INT NOT NULL REFERENCES rounds (id),
        valuation_dollar_drop_rate INT NOT NULL,
        valuation_stop_loss BIGINT NOT NULL,
        valuation_drop_interval_days INT NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz,
        CONSTRAINT valuation_dollar_drop_rate_check CHECK (valuation_dollar_drop_rate>0),
        CONSTRAINT valuation_stop_loss_check CHECK (valuation_stop_loss>0),
        CONSTRAINT valuation_drop_interval_days_check CHECK (valuation_drop_interval_days>0),
        PRIMARY KEY (round_id, created_at)
    );

CREATE TRIGGER sync_dutch_dynamic_rounds_updated_at BEFORE
UPDATE ON dutch_dynamic_rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE dutch_dynamic_rounds;

-- +goose StatementEnd