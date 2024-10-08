package ses

import (
	"testing"

	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/stretchr/testify/assert"
)

func TestSendEmail(t *testing.T) {
	// Create a Session with a custom region
	creds := credentials.NewStaticCredentials(
		"",
		"",
		"",
	)

	// Create a new SES client
	svc, err := NewClient(creds, "", "us-east-1")
	assert.NoError(t, err)

	// Define the email parameters
	assert.NoError(t, svc.Send(
		WithTextBody("Hello, this is a test email"),
		WithRecipients([]string{""}),
		WithSubject("Test Email"),
	))
}
