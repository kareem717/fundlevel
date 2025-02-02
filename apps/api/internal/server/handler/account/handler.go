package account

import (
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/account"
	"fundlevel/internal/entities/business"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/server/handler/shared"
	"fundlevel/internal/server/utils"
	"fundlevel/internal/service"
	"fundlevel/internal/service/types"

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

func (h *httpHandler) getByUserId(ctx context.Context, input *struct{}) (*shared.SingleAccountResponse, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	account, err := h.service.AccountService.GetByUserId(ctx, user.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Account not found")
		default:
			h.logger.Error("failed to fetch account", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the account")
		}
	}

	resp := &shared.SingleAccountResponse{}
	resp.Body.Message = "Account fetched successfully"
	resp.Body.Account = &account

	return resp, nil
}

type CreateAccountInput struct {
	Body account.CreateAccountParams `json:"account"`
}

func (h *httpHandler) create(ctx context.Context, input *CreateAccountInput) (*struct{}, error) {
	user := utils.GetAuthenticatedUser(ctx)
	if user == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	_, err := h.service.AccountService.Create(ctx, input.Body, user.ID)
	if err != nil {
		h.logger.Error("failed to create account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the account")
	}

	return &struct{}{}, nil
}

type UpdateAccountInput struct {
	Body account.UpdateAccountParams `json:"account"`
}

func (h *httpHandler) update(ctx context.Context, input *UpdateAccountInput) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	_, err := h.service.AccountService.Update(ctx, account.ID, input.Body)
	if err != nil {
		h.logger.Error("failed to update account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the account")
	}

	// TODO: Do we have to return anything?
	return &struct{}{}, nil
}

func (h *httpHandler) delete(ctx context.Context, input *struct{}) (*struct{}, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	err := h.service.AccountService.Delete(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to delete account", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the account")
	}

	return &struct{}{}, nil
}

type GetBusinessesOutput struct {
	Body struct {
		shared.MessageResponse
		Businesses []business.Business `json:"businesses"`
	}
}

func (h *httpHandler) getAllBusinesses(ctx context.Context, input *struct{}) (*GetBusinessesOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	businesses, err := h.service.AccountService.GetAllBusinesses(ctx, account.ID)

	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("businesses not found")
		default:
			h.logger.Error("failed to fetch businesses", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the businesses")
		}
	}

	resp := &GetBusinessesOutput{}
	resp.Body.Message = "Businesses fetched successfully"
	resp.Body.Businesses = businesses

	return resp, nil
}

type GetStripeIdentityVerificationSessionURLInput struct {
	Body struct {
		ReturnURL string `json:"return_url" default:"https://fundlevel.app"`
	}
}

type GetStripeIdentityVerificationSessionURLOutput struct {
	Body types.StripeSessionOutput
}

func (h *httpHandler) getStripeIdentityVerificationSessionURL(ctx context.Context, input *GetStripeIdentityVerificationSessionURLInput) (*GetStripeIdentityVerificationSessionURLOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	result, err := h.service.AccountService.GetStripeIdentityVerificationSessionURL(ctx, account.ID, input.Body.ReturnURL)
	if err != nil {
		h.logger.Error("failed to get stripe identity verification session url", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the stripe identity verification session url")
	}

	resp := &GetStripeIdentityVerificationSessionURLOutput{}
	resp.Body.URL = result.URL
	resp.Body.ClientSecret = result.ClientSecret

	return resp, nil
}

type GetStripeIdentityOutput struct {
	Body account.StripeIdentity
}

func (h *httpHandler) getStripeIdentity(ctx context.Context, input *struct{}) (*GetStripeIdentityOutput, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("Unauthorized")
	}

	stripeIdentity, err := h.service.AccountService.GetStripeIdentity(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to get stripe identity", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while getting the stripe identity")
	}

	resp := &GetStripeIdentityOutput{}
	resp.Body = stripeIdentity

	return resp, nil
}

type getInvestmentsResponse struct {
	Body struct {
		Investments []investment.Investment `json:"investments"`
		NextCursor *int                    `json:"next_cursor"`
	}
}

type getInvestmentsRequest struct {
	shared.CursorPaginationRequest
	Filter investment.InvestmentFilter `query:"filter" required:"false"`
}

func (h *httpHandler) getInvestments(ctx context.Context, input *getInvestmentsRequest) (*getInvestmentsResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to fetch investments")
	}

	investments, cursorOutput, err := h.service.AccountService.GetInvestments(ctx, account.ID, input.Cursor, input.Limit, input.Filter)
	if err != nil {
		h.logger.Error("failed to fetch investments", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investments")
	}

	resp := &getInvestmentsResponse{}
	resp.Body.Investments = investments
	resp.Body.NextCursor = cursorOutput

	return resp, nil
}

type getActiveInvestmentResponse struct {
	Body struct {
		Investment *investment.Investment `json:"investment"`
	}
}

func (h *httpHandler) getActiveRoundInvestment(ctx context.Context, input *shared.PathIDParam) (*getActiveInvestmentResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to fetch investments")
	}

	investment, err := h.service.AccountService.GetActiveRoundInvestment(ctx, account.ID, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("Active investment not found")
		default:
			h.logger.Error("failed to fetch active investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the active investment")
		}
	}

	resp := &getActiveInvestmentResponse{}
	resp.Body.Investment = &investment

	return resp, nil
}

type getInvestmentAggregateResponse struct {
	Body struct {
		InvestmentAggregate []investment.Aggregate `json:"investment_aggregate"`
	}
}

func (h *httpHandler) getInvestmentAggregate(ctx context.Context, input *struct{}) (*getInvestmentAggregateResponse, error) {
	account := utils.GetAuthenticatedAccount(ctx)
	if account == nil {
		return nil, huma.Error401Unauthorized("You must be logged in to fetch investments")
	}

	investmentAggregate, err := h.service.InvestmentService.AggregateByInvestorId(ctx, account.ID)
	if err != nil {
		h.logger.Error("failed to fetch investment aggregate", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment aggregate")
	}

	resp := &getInvestmentAggregateResponse{}
	resp.Body.InvestmentAggregate = investmentAggregate

	return resp, nil
}
