package business

import (
	"context"
	"fundlevel/internal/entities/business"
	storage "fundlevel/internal/storage/shared"
)

func (s *BusinessService) GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMemberWithRoleNameAndAccount, int, error) {
	return s.repositories.Business().GetMembersByPage(ctx, businessId, storage.OffsetPagination{
		Page:     page,
		PageSize: pageSize,
	})
}

func (s *BusinessService) GetAllMemberRoles(ctx context.Context) ([]business.BusinessMemberRole, error) {
	return s.repositories.Business().GetAllMemberRoles(ctx)
}
