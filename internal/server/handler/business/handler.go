package business

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/venture"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/service"

	"github.com/danielgtaylor/huma/v2"
	"go.uber.org/zap"
)

type httpHandler struct {
	service *service.Service
	logger  *zap.Logger
}

func newHTTPHandler(service *service.Service, logger *zap.Logger) *httpHandler {
	if service == nil {
		panic("service is nil")
	}

	if logger == nil {
		panic("logger is nil")
	}

	return &httpHandler{
		service: service,
		logger:  logger,
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*shared.SingleBusinessResponse, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Business not found")
		default:
			h.logger.Error("failed to fetch business", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	resp := &shared.SingleBusinessResponse{}
	resp.Body.Message = "Business fetched successfully"
	resp.Body.Business = &business

	return resp, nil
}

type CreateBusinessRequest struct {
	Body business.CreateBusinessParams `json:"business"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateBusinessRequest) (*shared.SingleBusinessResponse, error) {
	if account := shared.GetAuthenticatedAccount(ctx); account.ID != input.Body.Business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.Body.Business.OwnerAccountID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot create business for another account")
	}

	business, err := h.service.BusinessService.Create(ctx, input.Body)
	if err != nil {
		h.logger.Error("failed to create business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the business")
	}

	resp := &shared.SingleBusinessResponse{}
	resp.Body.Message = "Business created successfully"
	resp.Body.Business = &business

	return resp, nil
}

type DeleteBusinessOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteBusinessOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot delete business for another account")
	}

	err = h.service.BusinessService.Delete(ctx, business.ID)
	if err != nil {
		h.logger.Error("failed to delete business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the business")
	}

	resp := &DeleteBusinessOutput{}
	resp.Body.Message = "Business deleted successfully"

	return resp, nil
}

func (h *httpHandler) getRoundsByCursor(ctx context.Context, input *shared.GetRoundsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundsOutput, error) {
	limit := input.Limit + 1

	rounds, err := h.service.BusinessService.GetRoundsByCursor(ctx, input.ID, limit, input.Cursor, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the rounds")
		}
	}

	resp := &shared.GetCursorPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds

	if len(rounds) == limit {
		resp.Body.NextCursor = &rounds[len(rounds)-1].ID
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

func (h *httpHandler) getRoundsByPage(ctx context.Context, input *shared.GetRoundsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundsOutput, error) {
	rounds, total, err := h.service.BusinessService.GetRoundsByPage(ctx, input.ID, input.PageSize, input.Page, input.RoundFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("rounds not found")
		default:
			h.logger.Error("failed to fetch rounds", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundsOutput{}
	resp.Body.Message = "Rounds fetched successfully"
	resp.Body.Rounds = rounds
	resp.Body.Total = total

	if len(rounds) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Rounds = resp.Body.Rounds[:len(resp.Body.Rounds)-1]
	}

	return resp, nil
}

func (h *httpHandler) getInvestmentsByCursor(ctx context.Context, input *shared.GetInvestmentsByParentAndCursorInput) (*shared.GetCursorPaginatedRoundInvestmentsOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot access investments for another account")
	}

	limit := input.Limit + 1

	investments, err := h.service.BusinessService.GetInvestmentsByCursor(ctx, input.ID, limit, input.Cursor, input.InvestmentFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetCursorPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments

	if len(investments) == limit {
		resp.Body.NextCursor = &investments[len(investments)-1].ID
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

func (h *httpHandler) getInvestmentsByPage(ctx context.Context, input *shared.GetInvestmentsByParentAndPageInput) (*shared.GetOffsetPaginatedRoundInvestmentsOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot access investments for another account")
	}

	investments, total, err := h.service.BusinessService.GetInvestmentsByPage(ctx, input.ID, input.PageSize, input.Page, input.InvestmentFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("investments not found")
		default:
			h.logger.Error("failed to fetch investments", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
		}
	}

	resp := &shared.GetOffsetPaginatedRoundInvestmentsOutput{}
	resp.Body.Message = "Investments fetched successfully"
	resp.Body.Investments = investments
	resp.Body.Total = total
	if len(investments) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Investments = resp.Body.Investments[:len(resp.Body.Investments)-1]
	}

	return resp, nil
}

type GetVenturesByParentAndCursorInput struct {
	shared.GetCursorPaginatedByParentPathIDInput
	venture.VentureFilter
}

func (h *httpHandler) getVenturesByCursor(ctx context.Context, input *GetVenturesByParentAndCursorInput) (*shared.GetCursorPaginatedVenturesOutput, error) {
	limit := input.Limit + 1

	ventures, err := h.service.BusinessService.GetVenturesByCursor(ctx, input.ID, limit, input.Cursor, input.VentureFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetCursorPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures

	if len(ventures) == limit {
		resp.Body.NextCursor = &ventures[len(ventures)-1].ID
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

type GetVenturesByParentAndPageInput struct {
	shared.GetOffsetPaginatedByParentPathIDInput
	venture.VentureFilter
}

func (h *httpHandler) getVenturesByPage(ctx context.Context, input *GetVenturesByParentAndPageInput) (*shared.GetOffsetPaginatedVenturesOutput, error) {
	ventures, total, err := h.service.BusinessService.GetVenturesByPage(ctx, input.ID, input.PageSize, input.Page, input.VentureFilter)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("ventures not found")
		default:
			h.logger.Error("failed to fetch ventures", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the ventures")
		}
	}

	resp := &shared.GetOffsetPaginatedVenturesOutput{}
	resp.Body.Message = "Ventures fetched successfully"
	resp.Body.Ventures = ventures
	resp.Body.Total = total

	if len(ventures) > input.PageSize {
		resp.Body.HasMore = true
		resp.Body.Ventures = resp.Body.Ventures[:len(resp.Body.Ventures)-1]
	}

	return resp, nil
}

func (h *httpHandler) getTotalFunding(ctx context.Context, input *shared.PathIDParam) (*shared.FundingOutput, error) {
	totalFunding, err := h.service.BusinessService.GetTotalFunding(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch total funding", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the total funding")
	}

	resp := &shared.FundingOutput{}
	resp.Body.Message = "Total funding fetched successfully"
	resp.Body.TotalFunding = totalFunding

	return resp, nil
}

type OnboardStripeConnectedAccountInput struct {
	shared.PathIDParam
	Body struct {
		ReturnURL  string `json:"returnURL"`
		RefreshURL string `json:"refreshURL"`
	} `json:"body"`
}

func (h *httpHandler) onboardStripeConnectedAccount(ctx context.Context, input *OnboardStripeConnectedAccountInput) (*shared.URLOutput, error) {
	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if account := shared.GetAuthenticatedAccount(ctx); account.ID != business.OwnerAccountID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Connected account cannot be onboarded for another account")
	}

	link, err := h.service.BusinessService.CreateStripeAccountLink(ctx, business.StripeAccount.StripeConnectedAccountID, input.Body.ReturnURL, input.Body.RefreshURL)
	if err != nil {
		return nil, huma.Error500InternalServerError("An error occurred while creating the account link")
	}

	resp := &shared.URLOutput{}
	resp.Body.Message = "Account link created successfully"
	resp.Body.URL = link

	return resp, nil
}

func (h *httpHandler) getStripeDashboardURL(ctx context.Context, input *shared.PathIDParam) (*shared.URLOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	business, err := h.service.BusinessService.GetById(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, huma.Error404NotFound("Business not found")
		}

		h.logger.Error("failed to fetch business", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the business")
	}

	if business.OwnerAccountID != account.ID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", input.ID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot access stripe dashboard url for another account")
	}

	url, err := h.service.BusinessService.GetStripeDashboardURL(ctx, input.ID)
	if err != nil {
		return nil, huma.Error500InternalServerError("An error occurred while fetching the stripe dashboard url")
	}

	resp := &shared.URLOutput{}
	resp.Body.Message = "Stripe dashboard url fetched successfully"
	resp.Body.URL = url

	return resp, nil
}
