package industry

import (
	"context"

	"fundlevel/internal/entities/industry"
	"fundlevel/internal/storage"
)

type IndustryService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewIndustryService(repositories storage.Repository) *IndustryService {
	return &IndustryService{
		repositories: repositories,
	}
}

func (s *IndustryService) GetAll(ctx context.Context) ([]industry.Industry, error) {
	return s.repositories.Industry().GetAll(ctx)
}
