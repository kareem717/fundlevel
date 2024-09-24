package shared

import (
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

type OffsetPagination struct {
	Page     int `query:"page" required:"false" default:"1"`
	PageSize int `query:"pageSize" required:"false" default:"10"`
}

type CursorPagination struct {
	Cursor int `query:"cursor" required:"false" default:"0"`
	Limit  int `query:"limit" required:"false" default:"10"`
}

type PaginationRequest struct {
	*OffsetPagination
	*CursorPagination
}

func (i *GetManyByParentPathIDInput) Resolve(ctx huma.Context, prefix *huma.PathBuffer) []error {
	if i.CursorPagination != nil && i.OffsetPagination != nil {
		return []error{&huma.ErrorDetail{
			Message: "Cursor and Offset pagination cannot be used together",
		}}
	}

	return nil
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
