package business

import (
	"context"
	"fundlevel/internal/entities/business"
	storage "fundlevel/internal/storage/shared"
)

func (s *BusinessService) GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMemberWithRoleName, int, error) {
	return s.repositories.Business().GetMembersByPage(ctx, businessId, storage.OffsetPagination{
		Page:     page,
		PageSize: pageSize,
	})
}
