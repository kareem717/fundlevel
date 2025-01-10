package shared

import (
	"encoding/json"

	"github.com/stripe/stripe-go/v80"
)

func ParseStripeWebhook[T any](event stripe.Event) (*T, error) {
	var data T
	err := json.Unmarshal(event.Data.Raw, &data)
	if err != nil {
		return nil, err
	}

	return &data, nil
}
