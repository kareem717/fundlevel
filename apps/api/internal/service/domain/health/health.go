package health

import (
	"context"
	"time"

	"fundlevel/internal/storage"
	"go.uber.org/zap"
)

type HealthService struct {
	repositories storage.Repository
	logger       *zap.Logger
}

// NewHealthService returns a new instance of health service.
func NewHealthService(repositories storage.Repository, logger *zap.Logger) *HealthService {
	logger = logger.With(zap.String("service", "health"))

	return &HealthService{
		repositories: repositories,
		logger:       logger,
	}
}

func (s *HealthService) HealthCheck(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	return s.repositories.HealthCheck(ctx)
}
