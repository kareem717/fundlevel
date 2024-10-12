package billing

import (
	"context"
	"fmt"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/service/domain/billing/stripe"
	"fundlevel/internal/storage"
	"strconv"
	"time"
)

type BillingServiceConfig struct {
	APIKey                  string
	FeePercentage           float64
	TransactionFeeProductID string
	InvestmentFeeProductID  string
}

type BillingService struct {
	repositories            storage.Repository
	apiKey                  string
	feePercentage           float64
	transactionFeeProductID string
	investmentFeeProductID  string
	client                  *stripe.Client
}

// NewBillingService returns a new instance of billing service.
func NewBillingService(repositories storage.Repository, config BillingServiceConfig) *BillingService {
	client := stripe.NewClient(config.APIKey)

	return &BillingService{
		repositories:            repositories,
		apiKey:                  config.APIKey,
		feePercentage:           config.FeePercentage,
		transactionFeeProductID: config.TransactionFeeProductID,
		investmentFeeProductID:  config.InvestmentFeeProductID,
		client:                  client,
	}
}

func (s *BillingService) CreateInvestmentCheckoutSession(ctx context.Context, price int, successURL string, cancelURL string, investmentId int) (string, error) {
	resp, err := s.client.CreateCheckoutSession(
		fmt.Sprintf("%d", investmentId),
		price,
		s.transactionFeeProductID,
		s.investmentFeeProductID,
		s.feePercentage,
		successURL,
		cancelURL,
	)
	if err != nil {
		return "", err
	}

	return resp.URL, nil
}

func (s *BillingService) HandleInvestmentCheckoutSuccess(ctx context.Context, sessionID string) (string, error) {
	now := time.Now()

	session, err := s.client.GetSession(sessionID)
	if err != nil {
		return "", err
	}

	investmentID, ok := session.Metadata[stripe.InvestmentIDMetadataKey]
	if !ok {
		return "", fmt.Errorf("investment ID not found in session metadata")
	}

	investmentId, err := strconv.Atoi(investmentID)
	if err != nil {
		return "", fmt.Errorf("failed to convert investment ID to int: %w", err)
	}

	investmentRecord, err := s.repositories.Investment().GetById(ctx, investmentId)
	if err != nil {
		return "", fmt.Errorf("failed to get investment: %w", err)
	}

	updateParams := investment.UpdateInvestmentParams{
		// Status is updated to success as this is intended to be the final step - if desired we can delay this step
		Status:                investment.InvestmentStatusSuccessful,
		SignedAt:              investmentRecord.SignedAt,
		PaidAt:                &now,
		SignedStripeSessionID: &session.ID,
	}

	_, err = s.repositories.Investment().Update(ctx, investmentId, updateParams)
	if err != nil {
		// TODO: figure out how to reverse the transaction if it fails
		return "", fmt.Errorf("failed to update investment: %w", err)
	}

	return session.SuccessURL, nil
}
