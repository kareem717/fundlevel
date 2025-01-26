package permission

import (
	"fundlevel/internal/storage"
	"go.uber.org/zap"
)

type PermissionService struct {
	repo   storage.Repository
	logger *zap.Logger
}

// NewTestService returns a new instance of test service.
func NewPermissionService(repo storage.Repository, logger *zap.Logger) *PermissionService {
	logger = logger.With(zap.String("layer", "service"))
	return &PermissionService{repo: repo, logger: logger}
}
