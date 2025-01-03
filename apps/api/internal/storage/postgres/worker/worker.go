package worker

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/riverqueue/river"
	"github.com/uptrace/bun"
)

type WorkerRepository struct {
	Workers *river.Workers
	WorkerClient *river.Client[pgx.Tx]
}

// NewUserRepository returns a new instance of the repository.
func NewWorkerRepository(db bun.IDB, ctx context.Context) (*WorkerRepository, error) {
	workers := river.NewWorkers()

	if err := river.AddWorkerSafely(workers, &SortWorker{}); err != nil {
		return nil, err
	}

	return &WorkerRepository{
		Workers: workers,
	}, nil
}
