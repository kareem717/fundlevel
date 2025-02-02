package account

import (
	"context"
	"fundlevel/internal/entities/investment"
)

func (s *AccountService) GetActiveRoundInvestment(ctx context.Context, accountId int, roundId int) (investment.Investment, error) {
	return s.repositories.Account().GetActiveRoundInvestment(ctx, accountId, roundId)
}
