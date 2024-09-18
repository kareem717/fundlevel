-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    rounds (
        id serial PRIMARY KEY,
        offered_percentage NUMERIC(6, 3) NOT NULL,
        usd_percentage_value NUMERIC(10, 2) NOT NULL,
        minimum_investment_percentage NUMERIC(6, 3) NOT NULL,
        maximum_investment_percentage NUMERIC(6, 3) NOT NULL,
        is_auctioned BOOLEAN NOT NULL DEFAULT FALSE,
        start_time timestamptz NOT NULL,
        end_time timestamptz NOT NULL,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP(),
        updated_at timestamptz,
        deleted_at timestamptz
    );

-- Check that the investmentor_percentage_cap is between 0 and 100
ALTER TABLE rounds
ADD CONSTRAINT check_offered_percentage_range CHECK (offered_percentage BETWEEN 0 AND 100);

-- Check that the usd_percentage_value is greater than 0
ALTER TABLE rounds
ADD CONSTRAINT check_usd_percentage_value CHECK (usd_percentage_value>0);

-- Check that the minimum_investment_percentage is greater than 0
ALTER TABLE rounds
ADD CONSTRAINT check_minimum_investment_percentage_range CHECK (minimum_investment_percentage BETWEEN 0 AND 100);

-- Check that the maximum_investment_percentage is greater than 0
ALTER TABLE rounds
ADD CONSTRAINT check_maximum_investment_percentage_range CHECK (maximum_investment_percentage BETWEEN 0 AND 100);

-- Check that the maximum_investment_percentage is greater than the minimum_investment_percentage
ALTER TABLE rounds
ADD CONSTRAINT check_maximum_investment_percentage_is_greater_than_minimum CHECK (
    maximum_investment_percentage>minimum_investment_percentage
);

-- Check that the start_time is greater or equal to the current time
ALTER TABLE rounds
ADD CONSTRAINT check_start_time_is_greater_or_equal_to_current_time CHECK (
    start_time>= CURRENT_TIMESTAMP
);

-- Check that the end_time is greater than the start_time
ALTER TABLE rounds
ADD CONSTRAINT check_end_time_is_greater_than_start_time CHECK (
    end_time>start_time
);


CREATE TRIGGER sync_round_updated_at BEFORE
UPDATE ON rounds FOR EACH ROW
EXECUTE PROCEDURE sync_updated_at_column ();

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE rounds;

-- +goose StatementEnd