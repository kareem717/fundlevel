-- +goose Up
-- +goose StatementBegin
-- River migration 005 [up]
--
-- Rebuild the migration table so it's based on `(line, version)`.
--
DO $body$
BEGIN
    -- Tolerate users who may be using their own migration system rather than
    -- River's. If they are, they will have skipped version 001 containing
    -- `CREATE TABLE river_migration`, so this table won't exist.
    IF (SELECT to_regclass('river_migration') IS NOT NULL) THEN
        ALTER TABLE river_migration
            RENAME TO river_migration_old;

        CREATE TABLE river_migration(
            line TEXT NOT NULL,
            version bigint NOT NULL,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            CONSTRAINT line_length CHECK (char_length(line) > 0 AND char_length(line) < 128),
            CONSTRAINT version_gte_1 CHECK (version >= 1),
            PRIMARY KEY (line, version)
        );

        INSERT INTO river_migration
            (created_at, line, version)
        SELECT created_at, 'main', version
        FROM river_migration_old;

        DROP TABLE river_migration_old;
    END IF;
END;
$body$ LANGUAGE 'plpgsql';

--
-- Add `river_job.unique_key` and bring up an index on it.
--
-- These statements use `IF NOT EXISTS` to allow users with a `river_job` table
-- of non-trivial size to build the index `CONCURRENTLY` out of band of this
-- migration, then follow by completing the migration.
ALTER TABLE river_job
ADD COLUMN IF NOT EXISTS unique_key bytea;

CREATE UNIQUE INDEX IF NOT EXISTS river_job_kind_unique_key_idx ON river_job (kind, unique_key)
WHERE
    unique_key IS NOT NULL;

--
-- Create `river_client` and derivative.
--
-- This feature hasn't quite yet been implemented, but we're taking advantage of
-- the migration to add the schema early so that we can add it later without an
-- additional migration.
--
CREATE UNLOGGED TABLE
    river_client (
        id TEXT PRIMARY KEY NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        metadata jsonb NOT NULL DEFAULT '{}',
        paused_at timestamptz,
        updated_at timestamptz NOT NULL,
        CONSTRAINT name_length CHECK (
            CHAR_LENGTH(id)>0
            AND CHAR_LENGTH(id)<128
        )
    );

-- Differs from `river_queue` in that it tracks the queue state for a particular
-- active client.
CREATE UNLOGGED TABLE
    river_client_queue (
        river_client_id TEXT NOT NULL REFERENCES river_client (id) ON DELETE CASCADE,
        NAME TEXT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW(),
        max_workers BIGINT NOT NULL DEFAULT 0,
        metadata jsonb NOT NULL DEFAULT '{}',
        num_jobs_completed BIGINT NOT NULL DEFAULT 0,
        num_jobs_running BIGINT NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL,
        PRIMARY KEY (river_client_id, NAME),
        CONSTRAINT name_length CHECK (
            CHAR_LENGTH(NAME)>0
            AND CHAR_LENGTH(NAME)<128
        ),
        CONSTRAINT num_jobs_completed_zero_or_positive CHECK (num_jobs_completed>=0),
        CONSTRAINT num_jobs_running_zero_or_positive CHECK (num_jobs_running>=0)
    );

-- River migration 006 [up]
CREATE
OR REPLACE FUNCTION river_job_state_in_bitmask (bitmask BIT(8), state river_job_state) RETURNS BOOLEAN LANGUAGE SQL IMMUTABLE AS $$
    SELECT CASE state
        WHEN 'available' THEN get_bit(bitmask, 7)
        WHEN 'cancelled' THEN get_bit(bitmask, 6)
        WHEN 'completed' THEN get_bit(bitmask, 5)
        WHEN 'discarded' THEN get_bit(bitmask, 4)
        WHEN 'pending' THEN get_bit(bitmask, 3)
        WHEN 'retryable' THEN get_bit(bitmask, 2)
        WHEN 'running' THEN get_bit(bitmask, 1)
        WHEN 'scheduled' THEN get_bit(bitmask, 0)
        ELSE 0
    END = 1;
$$;

--
-- Add `river_job.unique_states` and bring up an index on it.
--
ALTER TABLE river_job
ADD COLUMN unique_states BIT(8);

-- This statement uses `IF NOT EXISTS` to allow users with a `river_job` table
-- of non-trivial size to build the index `CONCURRENTLY` out of band of this
-- migration, then follow by completing the migration.
CREATE UNIQUE INDEX IF NOT EXISTS river_job_unique_idx ON river_job (unique_key)
WHERE
    unique_key IS NOT NULL
    AND unique_states IS NOT NULL
    AND river_job_state_in_bitmask (unique_states, state);

-- Remove the old unique index. Users who are actively using the unique jobs
-- feature and who wish to avoid deploy downtime may want od drop this in a
-- subsequent migration once all jobs using the old unique system have been
-- completed (i.e. no more rows with non-null unique_key and null
-- unique_states).
DROP INDEX river_job_kind_unique_key_idx;

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
-- River migration 006 [down]
--
-- Drop `river_job.unique_states` and its index.
--
DROP INDEX river_job_unique_idx;

ALTER TABLE river_job
DROP COLUMN unique_states;

CREATE UNIQUE INDEX IF NOT EXISTS river_job_kind_unique_key_idx ON river_job (kind, unique_key)
WHERE
    unique_key IS NOT NULL;

--
-- Drop `river_job_state_in_bitmask` function.
--
DROP FUNCTION river_job_state_in_bitmask;

-- River migration 005 [down]
--
-- Revert to migration table based only on `(version)`.
--
-- If any non-main migrations are present, 005 is considered irreversible.
--
DO $body$
BEGIN
    -- Tolerate users who may be using their own migration system rather than
    -- River's. If they are, they will have skipped version 001 containing
    -- `CREATE TABLE river_migration`, so this table won't exist.
    IF (SELECT to_regclass('river_migration') IS NOT NULL) THEN
        IF EXISTS (
            SELECT *
            FROM river_migration
            WHERE line <> 'main'
        ) THEN
            RAISE EXCEPTION 'Found non-main migration lines in the database; version 005 migration is irreversible because it would result in loss of migration information.';
        END IF;

        ALTER TABLE river_migration
            RENAME TO river_migration_old;

        CREATE TABLE river_migration(
            id bigserial PRIMARY KEY,
            created_at timestamptz NOT NULL DEFAULT NOW(),
            version bigint NOT NULL,
            CONSTRAINT version CHECK (version >= 1)
        );

        CREATE UNIQUE INDEX ON river_migration USING btree(version);

        INSERT INTO river_migration
            (created_at, version)
        SELECT created_at, version
        FROM river_migration_old;

        DROP TABLE river_migration_old;
    END IF;
END;
$body$ LANGUAGE 'plpgsql';

--
-- Drop `river_job.unique_key`.
--
ALTER TABLE river_job
DROP COLUMN unique_key;

--
-- Drop `river_client` and derivative.
--
DROP TABLE river_client_queue;

DROP TABLE river_client;

-- +goose StatementEnd