package panadadoc

import "time"

// ErrorResponse is the error response from the Panadadoc API.
type ErrorResponse struct {
	Type   string `json:"type"`
	Detail string `json:"detail"`
}

type Document struct {
	ID             string     `json:"id"`
	Name           string     `json:"name"`
	Status         string     `json:"status"`
	DateCreated    time.Time  `json:"date_created"`
	DateModified   time.Time  `json:"date_modified"`
	ExpirationDate *time.Time `json:"expiration_date"`
	Version        string     `json:"version"`
}
