package round

import (
	"fundlevel/internal/storage"
)

type RoundService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewRoundService(repositories storage.Repository) *RoundService {
	return &RoundService{
		repositories: repositories,
	}
}
