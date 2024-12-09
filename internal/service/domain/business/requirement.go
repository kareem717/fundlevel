package business

import (
	"context"
	"fundlevel/internal/entities/business"
)

func (s *BusinessService) GetRoundCreateRequirements(ctx context.Context, businessId int) (business.RoundCreateRequirements, error) {
	businessRecord, err := s.GetById(ctx, businessId)
	if err != nil {
		return business.RoundCreateRequirements{}, err
	}

	return business.RoundCreateRequirements{
		LegalSection:   businessRecord.BusinessLegalSectionID != nil,
		AddressSection: businessRecord.AddressID != nil,
		StripeAccount:  businessRecord.StripeAccount != nil,
	}, nil
}
