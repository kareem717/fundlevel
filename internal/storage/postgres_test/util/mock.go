package util

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"testing"
	"time"

	"fundlevel/internal/storage/postgres/migrations"
	"fundlevel/internal/storage/postgres_test/seed"

	"github.com/alexlast/bunzap"
	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"go.uber.org/zap"
)

type Logger struct {
}

func (l *Logger) Printf(format string, v ...any) {

}

func SetupTestDB(t *testing.T, seedConfig seed.SeedConfig) (*bun.DB, *seed.SeedResult) {
	ctx := context.Background()

	req := testcontainers.ContainerRequest{
		Image:        "postgres:13",
		ExposedPorts: []string{"5432/tcp"},
		Env: map[string]string{
			"POSTGRES_USER":     "test",
			"POSTGRES_PASSWORD": "test",
			"POSTGRES_DB":       "testdb",
		},
		WaitingFor: wait.ForListeningPort("5432/tcp").WithStartupTimeout(5 * time.Minute),
	}

	postgresC, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
		Logger:           &Logger{},
	})
	if err != nil {
		t.Fatalf("failed to start container: %s", err)
	}

	t.Cleanup(func() {
		// Ensure the container is terminated after the test
		postgresC.Terminate(ctx)
	})

	host, err := postgresC.Host(ctx)
	if err != nil {
		t.Fatalf("failed to get container host: %s", err)
	}

	port, err := postgresC.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatalf("failed to get container port: %s", err)
	}

	dsn := fmt.Sprintf("postgres://test:test@%s:%s/testdb?sslmode=disable", host, port.Port())

	sqldb, err := sql.Open("postgres", dsn)
	if err != nil {
		t.Fatalf("failed to open database: %s", err)
	}

	db := bun.NewDB(sqldb, pgdialect.New())

	t.Cleanup(func() {
		// Ensure the database connection is closed after the test
		db.Close()
	})

	logger, err := zap.NewProduction()
	if err != nil {
		t.Fatalf("failed to create logger: %s", err)
	}

	db.AddQueryHook(bunzap.NewQueryHook(bunzap.QueryHookOptions{
		Logger:       logger,
		SlowDuration: 200 * time.Millisecond, // Omit to log all operations as debug
	}))

	// Increase timeout duration
	pingCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	t.Logf("Attempting to ping the database...")
	err = db.PingContext(pingCtx)
	if err != nil {
		switch {
		case errors.Is(err, context.Canceled):
			t.Fatalf("ping was canceled by the client: %v", err)
		case errors.Is(err, context.DeadlineExceeded):
			t.Fatalf("ping timed out: %v", err)
		default:
			t.Fatalf("ping failed: %v", err)
		}
	}

	// Create auth schema and users table
	_, err = db.Exec(`CREATE SCHEMA auth; CREATE TABLE auth.users (id UUID PRIMARY KEY);`)
	if err != nil {
		t.Fatalf("failed to create auth schema and users table: %s", err)
	}

	// Set the working directory for goose
	goose.SetBaseFS(migrations.MigrationsFS)

	// Run migrations
	if err := goose.Up(sqldb, "."); err != nil {
		t.Fatalf("failed to run migrations: %s", err)
	}

	seedResult, err := seed.SeedDB(sqldb, seedConfig)
	if err != nil {
		t.Fatalf("failed to seed database: %s", err)
	}

	return db, seedResult
}
