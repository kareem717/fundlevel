package panadadoc

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const baseURL = "https://api.pandadoc.com/public/v1"

type Client struct {
	apiKey string
}

func NewClient(apiKey string) *Client {
	return &Client{apiKey: fmt.Sprintf("API-Key %s", apiKey)}
}

type ListDocumentsResponse struct {
	Results []Document `json:"results"`
}

func (c *Client) ListDocuments() ([]Document, error) {
	response, err := c.makeRequest(GET, "/documents")
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	var listResponse ListDocumentsResponse
	// Decode the response body into the ListDocumentsResponse struct
	err = json.NewDecoder(response.Body).Decode(&listResponse)
	if err != nil {
		return nil, err
	}

	return listResponse.Results, nil
}

type Method string

const (
	GET    Method = "GET"
	POST   Method = "POST"
	PUT    Method = "PUT"
	DELETE Method = "DELETE"
)

func (c *Client) makeRequest(method Method, path string) (*http.Response, error) {
	url := fmt.Sprintf("%s%s", baseURL, path)

	req, err := http.NewRequest(string(method), url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", c.apiKey)

	return http.DefaultClient.Do(req)
}
