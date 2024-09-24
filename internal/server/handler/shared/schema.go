package shared

import (
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"

	"github.com/google/uuid"
)

type PaginationRequest struct {
	Cursor int `query:"cursor" required:"false" default:"0"`
	Limit  int `query:"limit" required:"false" default:"10"`
}

type PathIDParam struct {
	ID int `path:"id"`
}

type PathUserIDParam struct {
	UserID uuid.UUID `path:"userId"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type PaginationResponse struct {
	NextCursor *int `json:"nextCursor"`
	HasMore    bool `json:"hasMore"`
}

type GetManyByParentPathIDInput struct {
	PathIDParam
	PaginationRequest
}

type GetManyRoundsOutput struct {
	Body struct {
		MessageResponse
		Rounds []round.Round `json:"rounds"`
		PaginationResponse
	}
}

type GetManyVenturesOutput struct {
	Body struct {
		MessageResponse
		Ventures []venture.Venture `json:"ventures"`
		PaginationResponse
	}
}

type SingleAccountResponse struct {
	Body struct {
		MessageResponse
		Account *account.Account `json:"account"`
	}
}
