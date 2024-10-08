package panadadoc

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewClient(t *testing.T) {
	apiKey := "test"

	client := NewClient(apiKey)

	assert.Equal(t, fmt.Sprintf("API-Key %s", apiKey), client.apiKey)
}

func TestMakeRequest(t *testing.T) {
	apiKey := "test"
	client := NewClient(apiKey)

	response, err := client.makeRequest(GET, "/documents")
	assert.NoError(t, err)
	assert.NotNil(t, response)
	assert.Equal(t, response.Request.URL.String(), baseURL+"/documents")
}

func TestListDocuments(t *testing.T) {
	apiKey := ""
	client := NewClient(apiKey)

	documents, err := client.ListDocuments()
	assert.NoError(t, err)
	assert.NotNil(t, documents)
	t.Logf("%+v", documents)
}
