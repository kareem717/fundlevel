-- +goose Up
-- +goose StatementBegin
CREATE EXTENSION pg_cron;

CREATE TABLE
    daily_aggregated_business_analytics (
        business_id INT NOT NULL REFERENCES businesses,
        day_of_year INT NOT NULL,
        impressions_count INT NOT NULL DEFAULT 0,
        uniques_impressions_count INT NOT NULL DEFAULT 0,
        favourited_count INT NOT NULL DEFAULT 0,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP() NOT NULL,
        PRIMARY KEY (business_id, day_of_year)
    );

SELECT
    cron.schedule (
        'aggregate-daily-business-analytics',
        '0 4 * * *',
        $$
        WITH
            impression_counts AS (
                SELECT
                    business_id,
                    COUNT(*) AS impressions_count,
                    COUNT(DISTINCT account_id) AS uniques_impressions_count
                FROM
                    business_impressions
                WHERE
                    created_at > NOW() - INTERVAL '1 day'
                GROUP BY
                    business_id
            ),
            favourited_counts AS (
                SELECT
                    bf.business_id,
                    COUNT(*) AS favourited_count
                FROM
                    business_favourites bf
                WHERE
                    bf.created_at > NOW() - INTERVAL '1 day'
                GROUP BY
                    bf.business_id
            )
        INSERT INTO
            daily_aggregated_business_analytics (
                day_of_year,
                business_id,
                impressions_count,
                uniques_impressions_count,
                favourited_count
            )
        SELECT
            EXTRACT(
                DOY
                FROM
                    NOW()
            ) AS day_of_year,
            COALESCE(ic.business_id, fc.business_id) AS business_id,
            COALESCE(ic.impressions_count, 0) AS impressions_count,
            COALESCE(ic.uniques_impressions_count, 0) AS uniques_impressions_count,
            COALESCE(fc.favourited_count, 0) AS favourited_count
        FROM
            impression_counts ic
            FULL OUTER JOIN favourited_counts fc ON ic.business_id = fc.business_id;
        $$
    );

SELECT
    cron.schedule (
        'remove-last-year-business-analytics',
        '0 4 1 1 *',
        $$
        DELETE FROM daily_aggregated_business_analytics WHERE created_at < NOW() - INTERVAL '1 year';
        $$
    );

CREATE TABLE
    daily_aggregated_round_analytics (
        round_id INT NOT NULL REFERENCES rounds,
        day_of_year INT NOT NULL,
        impressions_count INT NOT NULL DEFAULT 0,
        uniques_impressions_count INT NOT NULL DEFAULT 0,
        favourited_count INT NOT NULL DEFAULT 0,
        created_at timestamptz DEFAULT CLOCK_TIMESTAMP() NOT NULL,
        PRIMARY KEY (round_id, day_of_year)
    );

SELECT
    cron.schedule (
        'aggregate-daily-round-analytics',
        '0 4 * * *',
        $$
        WITH
            impression_counts AS (
                SELECT
                    round_id,
                    COUNT(*) AS impressions_count,
                    COUNT(DISTINCT account_id) AS uniques_impressions_count
                FROM
                    round_impressions
                WHERE
                    created_at > NOW() - INTERVAL '1 day'
                GROUP BY
                    round_id
            ),
            favourited_counts AS (
                SELECT
                    bf.round_id,
                    COUNT(*) AS favourited_count
                FROM
                    round_favourites bf
                WHERE
                    bf.created_at > NOW() - INTERVAL '1 day'
                GROUP BY
                    bf.round_id
            )
        INSERT INTO
            daily_aggregated_round_analytics (
                day_of_year,
                round_id,
                impressions_count,
                uniques_impressions_count,
                favourited_count
            )
        SELECT
            EXTRACT(
                DOY
                FROM
                    NOW()
            ) AS day_of_year,
            COALESCE(ic.round_id, fc.round_id) AS round_id,
            COALESCE(ic.impressions_count, 0) AS impressions_count,
            COALESCE(ic.uniques_impressions_count, 0) AS uniques_impressions_count,
            COALESCE(fc.favourited_count, 0) AS favourited_count
        FROM
            impression_counts ic
            FULL OUTER JOIN favourited_counts fc ON ic.round_id = fc.round_id;
        $$
    );

SELECT
    cron.schedule (
        'remove-last-year-round-analytics',
        '0 4 1 1 *',
        $$
        DELETE FROM daily_aggregated_round_analytics WHERE created_at < NOW() - INTERVAL '1 year';
        $$
    );

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT
    cron.unschedule ('remove-last-year-round-analytics');

SELECT
    cron.unschedule ('aggregate-daily-round-analytics');

DROP TABLE daily_aggregated_round_analytics;

SELECT
    cron.unschedule ('remove-last-year-business-analytics');

SELECT
    cron.unschedule ('aggregate-daily-business-analytics');

DROP TABLE daily_aggregated_business_analytics;

DROP EXTENSION pg_cron;

-- +goose StatementEnd