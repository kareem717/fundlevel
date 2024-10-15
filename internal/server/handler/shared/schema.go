package shared

import (
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/entities/venture"

	"github.com/google/uuid"
)

type OffsetPaginationRequest struct {
	Page     int `query:"page" required:"false" default:"1"`
	PageSize int `query:"pageSize" required:"false" default:"10"`
}

type CursorPaginationRequest struct {
	Cursor int `query:"cursor" required:"false" default:"1"`
	Limit  int `query:"limit" required:"false" default:"10"`
}

type PathIDParam struct {
	ID int `path:"id" minimum:"1"`
}

type PathUserIDParam struct {
	UserID uuid.UUID `path:"userId"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type MessageOutput struct {
	Body MessageResponse
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

type GetCursorPaginatedRoundsOutput struct {
	Body struct {
		MessageResponse
		Rounds []round.Round `json:"rounds"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedRoundsOutput struct {
	Body struct {
		MessageResponse
		Rounds []round.Round `json:"rounds"`
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

type GetCursorPaginatedRoundInvestmentsOutput struct {
	Body struct {
		MessageResponse
		Investments []investment.RoundInvestment `json:"investments"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedRoundInvestmentsOutput struct {
	Body struct {
		MessageResponse
		Investments []investment.RoundInvestment `json:"investments"`
		OffsetPaginationResponse
	}
}

type SingleAccountResponse struct {
	Body struct {
		MessageResponse
		Account *account.Account `json:"account"`
	}
}

type ParentInvestmentIDParam struct {
	PathIDParam
	InvestmentID int `path:"investmentId" minimum:"1"`
}

type SingleBusinessResponse struct {
	Body struct {
		MessageResponse
		Business *business.Business `json:"business"`
	}
}

type GetOffsetPaginatedBusinessesOutput struct {
	Body struct {
		MessageResponse
		Businesses []business.Business `json:"businesses"`
		OffsetPaginationResponse
	}
}

type SingleInvestmentResponse struct {
	Body struct {
		MessageResponse
		Investment *investment.RoundInvestment `json:"investment"`
	}
}

type IsLikedOutput struct {
	Body struct {
		MessageResponse
		Liked bool `json:"liked"`
	}
}

type GetLikeCountOutput struct {
	Body struct {
		MessageResponse
		Count int `json:"count"`
	}
}
