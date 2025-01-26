package industry

import (
	"context"

	"fundlevel/internal/entities/industry"
	"fundlevel/internal/storage"
	"go.uber.org/zap"
)

type IndustryService struct {
	repositories storage.Repository
	logger       *zap.Logger
}

// NewTestService returns a new instance of test service.
func NewIndustryService(repositories storage.Repository, logger *zap.Logger) *IndustryService {
	logger = logger.With(zap.String("service", "industry"))

	return &IndustryService{
		repositories: repositories,
		logger:       logger,
	}
}

func (s *IndustryService) GetAll(ctx context.Context) ([]industry.Industry, error) {
	return s.repositories.Industry().GetAll(ctx)
}
