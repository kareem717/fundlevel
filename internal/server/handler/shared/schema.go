package shared

import (
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"

	"github.com/google/uuid"
)

type OffsetPaginationRequest struct {
	Page     int `query:"page" required:"false" default:"1"`
	PageSize int `query:"pageSize" required:"false" default:"10"`
}

type CursorPaginationRequest struct {
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

type CursorPaginationResponse struct {
	NextCursor *int `json:"nextCursor"`
	HasMore    bool `json:"hasMore"`
}

type OffsetPaginationResponse struct {
	HasMore bool `json:"hasMore"`
}

type GetOffsetPaginatedByParentPathIDInput struct {
	PathIDParam
	OffsetPaginationRequest
}

type GetCursorPaginatedByParentPathIDInput struct {
	PathIDParam
	CursorPaginationRequest
}

type GetCursorPaginatedFixedTotalRoundsOutput struct {
	Body struct {
		MessageResponse
		FixedTotalRounds []round.FixedTotalRound `json:"fixedTotalRounds"`
		CursorPaginationResponse
	}
}

type GetCursorPaginatedRegularDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		RegularDynamicRounds []round.RegularDynamicRound `json:"regularDynamicRounds"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedFixedTotalRoundsOutput struct {
	Body struct {
		MessageResponse
		FixedTotalRounds []round.FixedTotalRound `json:"fixedTotalRounds"`
		OffsetPaginationResponse
	}
}

type GetOffsetPaginatedRegularDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		RegularDynamicRounds []round.RegularDynamicRound `json:"regularDynamicRounds"`
		OffsetPaginationResponse
	}
}

type GetCursorPaginatedVenturesOutput struct {
	Body struct {
		MessageResponse
		Ventures []venture.Venture `json:"ventures"`
		CursorPaginationResponse
	}
}
type GetOffsetPaginatedVenturesOutput struct {
	Body struct {
		MessageResponse
		Ventures []venture.Venture `json:"ventures"`
		OffsetPaginationResponse
	}
}

type SingleAccountResponse struct {
	Body struct {
		MessageResponse
		Account *account.Account `json:"account"`
	}
}
