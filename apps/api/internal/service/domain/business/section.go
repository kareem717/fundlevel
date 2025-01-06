package business

import (
	"context"
	"fundlevel/internal/entities/business"
)

func (s *BusinessService) UpsertBusinessLegalSection(ctx context.Context, businessId int, params business.UpsertBusinessLegalSectionParams) error {
	return s.repositories.Business().UpsertBusinessLegalSection(ctx, businessId, params)
}

