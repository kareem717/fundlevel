package shared

import (
	"encoding/json"
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
	"time"

	"github.com/google/uuid"
)

type OffsetPaginationRequest struct {
	Page     int `query:"page" required:"false" minimum:"1" default:"1"`
	PageSize int `query:"pageSize" required:"false" minimum:"1" default:"10"`
}

type CursorPaginationRequest struct {
	Cursor int `query:"cursor" required:"false" minimum:"1"`
	Limit  int `query:"limit" required:"false" minimum:"1" default:"10"`
}

type PathIDParam struct {
	ID int `path:"id" minimum:"1"`
}

type URLOutput struct {
	Body struct {
		MessageResponse
		URL string `json:"url"`
	}
}

type TimeCursorPaginationResponse struct {
	NextCursor *time.Time `json:"nextCursor"`
	HasNext    bool       `json:"hasNext"`
}

type TimeCursorPaginationRequest struct {
	Cursor time.Time `query:"cursor" required:"false"`
	Limit  int       `query:"limit" required:"false" minimum:"1" default:"10"`
}

type HandleStripeWebhookInput struct {
	Signature string `header:"Stripe-Signature"`
	Body      json.RawMessage
}

type GetRoundsByParentAndCursorInput struct {
	GetCursorPaginatedByParentPathIDInput
	round.RoundFilter
}

type GetRoundsByParentAndPageInput struct {
	GetOffsetPaginatedByParentPathIDInput
	round.RoundFilter
}

type GetInvestmentsByParentAndCursorInput struct {
	GetCursorPaginatedByParentPathIDInput
	investment.InvestmentFilter
}

type GetInvestmentsByParentAndPageInput struct {
	GetOffsetPaginatedByParentPathIDInput
	investment.InvestmentFilter
}

type FundingOutput struct {
	Body struct {
		MessageResponse
		TotalFunding int `json:"totalFunding"`
	}
}

type SingleRoundWithBusinessResponse struct {
	Body struct {
		MessageResponse
		Round *round.RoundWithBusiness `json:"round"`
	}
}

type SingleRoundResponse struct {
	Body struct {
		MessageResponse
		Round *round.Round `json:"round"`
	}
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
	Total   int  `json:"total"`
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

type GetCursorPaginatedInvestmentsOutput struct {
	Body struct {
		MessageResponse
		Investments []investment.Investment `json:"investments"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedInvestmentsOutput struct {
	Body struct {
		MessageResponse
		Investments []investment.Investment `json:"investments"`
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
		Investment *investment.Investment `json:"investment"`
	}
}

type IsFavouritedOutput struct {
	Body struct {
		MessageResponse
		Favourited bool `json:"favourited"`
	}
}

type GetLikeCountOutput struct {
	Body struct {
		MessageResponse
		Count int `json:"count"`
	}
}
