package permission

import (
	"fundlevel/internal/storage"
)

type PermissionService struct {
	repo storage.Repository
}

// NewTestService returns a new instance of test service.
func NewPermissionService(repo storage.Repository) *PermissionService {
	return &PermissionService{repo: repo}
}