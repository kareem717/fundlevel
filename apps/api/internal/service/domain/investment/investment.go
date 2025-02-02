package investment

import (
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/domain/round"
	"fundlevel/internal/storage"
	"strconv"

	"go.uber.org/zap"
)

type InvestmentService struct {
	repositories  storage.Repository
	stripeAPIKey  string
	feePercentage float64
	logger        *zap.Logger
	roundService  *round.RoundService
}

// NewInvestmentService returns a new instance of investment service.
func NewInvestmentService(repositories storage.Repository, stripeAPIKey string, feePercentage float64, logger *zap.Logger, roundService *round.RoundService) *InvestmentService {
	logger = logger.With(zap.String("service", "investment"))

	return &InvestmentService{
		repositories:  repositories,
		stripeAPIKey:  stripeAPIKey,
		feePercentage: feePercentage,
		roundService:  roundService,
		logger:        logger,
	}
}

func (s *InvestmentService) GetById(ctx context.Context, id int) (investment.Investment, error) {
	return s.repositories.Investment().GetById(ctx, id)
}

func (s *InvestmentService) Upsert(
	ctx context.Context,
	investorID int,
	params investment.CreateInvestmentParams,
) (investment.Investment, error) {
	round, err := s.roundService.GetById(ctx, params.RoundID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			s.logger.Error("round not found", zap.Int("round id", params.RoundID))
			return investment.Investment{}, errors.New("round not found")
		default:
			s.logger.Error("failed to fetch round", zap.Error(err))
			return investment.Investment{}, errors.New("an error occurred while fetching the round")
		}
	}
	usdCentValue := round.PricePerShareUSDCents * int64(params.ShareQuantity)

	activeInvestment, err := s.repositories.Account().GetActiveRoundInvestment(ctx, investorID, round.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return s.repositories.Investment().Create(ctx, investorID, usdCentValue, params)
		default:
			s.logger.Error("failed to fetch active investment", zap.Error(err))
			return investment.Investment{}, errors.New("an error occurred while fetching the active investment")
		}
	}

	//update the existing investment
	return s.repositories.Investment().Update(ctx, activeInvestment.ID, investment.UpdateInvestmentParams{
		ShareQuantity: &params.ShareQuantity,
		TermAcceptance: &investment.TermAcceptance{
			TermsID:                  params.TermsID,
			TermsAcceptedAt:          params.TermsAcceptedAt,
			TermsAcceptanceIPAddress: params.TermsAcceptanceIPAddress,
			TermsAcceptanceUserAgent: params.TermsAcceptanceUserAgent,
		},
	})
}

func (s *InvestmentService) Update(ctx context.Context, id int, params investment.UpdateInvestmentParams) (investment.Investment, error) {
	//TODO: switch to AUthorization service
	investmentRecord, err := s.GetById(ctx, id)
	if err != nil {
		return investment.Investment{}, err
	}

	if investmentRecord.Status != investment.InvestmentStatusAwaitingConfirmation {
		s.logger.Error("investment is not in the correct status to be updated", zap.String("investment_id", strconv.Itoa(id)), zap.String("status", string(investmentRecord.Status)))
		return investment.Investment{}, errors.New("investment is not in the correct status to be updated")
	}

	return s.repositories.Investment().Update(ctx, id, params)
}
