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

	req := business.RoundCreateRequirements{
		LegalSection: businessRecord.BusinessLegalSectionID != nil,
	}

	if businessRecord.StripeAccount != nil {
		req.StripeAccount =
			businessRecord.StripeAccount.StripePayoutsEnabled &&
				businessRecord.StripeAccount.StripeTransfersEnabled &&
				businessRecord.StripeAccount.StripeDisabledReason == nil
	}

	return req, nil
}
