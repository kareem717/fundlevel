package business

import (
	"context"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/storage/postgres/shared"
)

func (s *BusinessService) CreateMember(ctx context.Context, params business.CreateBusinessMemberParams) (business.BusinessMember, error) {
	return s.repositories.Business().CreateMember(ctx, params)
}

func (s *BusinessService) DeleteMember(ctx context.Context, businessId int, accountId int) error {
	return s.repositories.Business().DeleteMember(ctx, businessId, accountId)
}

func (s *BusinessService) UpdateMember(ctx context.Context, businessId int, accountId int, params business.UpdateBusinessMemberParams) (business.BusinessMember, error) {
	return s.repositories.Business().UpdateMember(ctx, businessId, accountId, params)
}

func (s *BusinessService) GetMembersByPage(ctx context.Context, businessId int, pageSize int, page int) ([]business.BusinessMember, error) {
	paginationParams := shared.OffsetPagination{
		PageSize: pageSize,
		Page:     page,
	}

	return s.repositories.Business().GetMembersByPage(ctx, businessId, paginationParams)
}
