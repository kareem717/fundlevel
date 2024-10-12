package billing

import (
	"fmt"
	"fundlevel/internal/service/domain/billing/stripe"
	"fundlevel/internal/storage"
	"log"
	"strconv"
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

// NewTestService returns a new instance of test service.
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

func (s *BillingService) CreateCheckoutSession(price int, successURL string, cancelURL string, investmentId int) (string, error) {
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

func (s *BillingService) HandleCheckoutSuccess(sessionID string) (string, error) {
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

	log.Printf("investment ID: %d", investmentId)

	return session.SuccessURL, nil
}
