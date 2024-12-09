package business

import (
	"context"
	"fundlevel/internal/entities/business"
)

func (s *BusinessService) CreateBusinessLegalSection(ctx context.Context, businessId int, params business.CreateBusinessLegalSectionParams) error {
	return s.repositories.Business().CreateBusinessLegalSection(ctx, businessId, params)	
}
