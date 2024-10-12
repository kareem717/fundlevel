package stripe

import (
	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/checkout/session"
)

type Client struct {
	StripeAPIKey string
}

func NewClient(stripeAPIKey string) *Client {
	return &Client{StripeAPIKey: stripeAPIKey}
}

const (
	InvestmentIDMetadataKey = "investmentId"
)

func (c *Client) CreateCheckoutSession(
	investmentId string,
	price int,
	transactionFeeProductID string,
	investmentFeeProductID string,
	feePercentage float64,
	successURL string,
	cancelURL string,
) (*stripe.CheckoutSession, error) {
	feeCents := (float64(price) * feePercentage)

	stripe.Key = c.StripeAPIKey
	checkoutParams := &stripe.CheckoutSessionParams{
		SuccessURL: stripe.String(successURL),
		CancelURL:  stripe.String(cancelURL),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String(string(stripe.CurrencyUSD)),
					UnitAmount: stripe.Int64(int64(price)),
					Product:    stripe.String(transactionFeeProductID),
				},
				Quantity: stripe.Int64(1),
			},
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency:   stripe.String(string(stripe.CurrencyUSD)),
					UnitAmount: stripe.Int64(int64(feeCents)),
					Product:    stripe.String(investmentFeeProductID),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		Metadata: map[string]string{
			InvestmentIDMetadataKey: investmentId,
		},
	}

	s, err := session.New(checkoutParams)
	return s, err
}

func (c *Client) GetSession(sessionID string) (*stripe.CheckoutSession, error) {
	stripe.Key = c.StripeAPIKey
	sess, err := session.Get(sessionID, nil)
	return sess, err
}
