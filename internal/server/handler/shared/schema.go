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

type GetCursorPaginatedRoundsWithSubtypesOutput struct {
	Body struct {
		MessageResponse
		RoundWithSubtypes []round.RoundWithSubtypes `json:"roundsWithSubtypes"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedRoundsWithSubtypesOutput struct {
	Body struct {
		MessageResponse
		RoundWithSubtypes []round.RoundWithSubtypes `json:"roundsWithSubtypes"`
		OffsetPaginationResponse
	}
}

type GetCursorPaginatedFixedTotalRoundsOutput struct {
	Body struct {
		MessageResponse
		FixedTotalRounds []round.FixedTotalRound `json:"fixedTotalRounds"`
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
type GetCursorPaginatedRegularDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		RegularDynamicRounds []round.RegularDynamicRound `json:"regularDynamicRounds"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedRegularDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		RegularDynamicRounds []round.RegularDynamicRound `json:"regularDynamicRounds"`
		OffsetPaginationResponse
	}
}
type GetCursorPaginatedPartialTotalRoundsOutput struct {
	Body struct {
		MessageResponse
		PartialTotalRounds []round.PartialTotalRound `json:"partialTotalRounds"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedPartialTotalRoundsOutput struct {
	Body struct {
		MessageResponse
		PartialTotalRounds []round.PartialTotalRound `json:"partialTotalRounds"`
		OffsetPaginationResponse
	}
}

type GetCursorPaginatedDutchDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		DutchDynamicRounds []round.DutchDynamicRound `json:"dutchDynamicRounds"`
		CursorPaginationResponse
	}
}

type GetOffsetPaginatedDutchDynamicRoundsOutput struct {
	Body struct {
		MessageResponse
		DutchDynamicRounds []round.DutchDynamicRound `json:"dutchDynamicRounds"`
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

type SingleBusinessMemberResponse struct {
	Body struct {
		MessageResponse
		BusinessMember *business.BusinessMember `json:"businessMember"`
	}
}

type GetOffsetPaginatedBusinessesOutput struct {
	Body struct {
		MessageResponse
		Businesses []business.Business `json:"businesses"`
		OffsetPaginationResponse
	}
}
