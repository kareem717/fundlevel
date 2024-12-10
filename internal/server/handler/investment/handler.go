package investment

import (
	"context"
	"database/sql"
	"errors"
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

// func (h *httpHandler) processInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
// 	investmentResult, err := h.service.InvestmentService.GetById(ctx, input.ID)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, sql.ErrNoRows):
// 			h.logger.Error("investment not found", zap.Int("investment id", input.ID))
// 			return nil, huma.Error404NotFound("investment not found")
// 		default:
// 			h.logger.Error("failed to fetch investment", zap.Error(err))
// 			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
// 		}
// 	}

// 	if investmentResult.Status != investment.InvestmentIntentStatusPending {
// 		h.logger.Error("investment is not pending", zap.Int("investment id", input.ID))
// 		return nil, huma.Error400BadRequest("Investment is not pending")
// 	}

// 	round, err := h.service.RoundService.GetById(ctx, investmentResult.RoundID)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, sql.ErrNoRows):
// 			h.logger.Error("round not found", zap.Int("round id", investmentResult.RoundID))
// 			return nil, huma.Error404NotFound("round not found")
// 		default:
// 			h.logger.Error("failed to fetch round", zap.Error(err))
// 			return nil, huma.Error500InternalServerError("An error occurred while fetching the round")
// 		}
// 	}

// 	if account := shared.GetAuthenticatedAccount(ctx); account.ID != round.Venture.Business.OwnerAccountID {
// 		h.logger.Error("business owner account id does not match authenticated account id",
// 			zap.Any("business owner account id", round.Venture.Business.OwnerAccountID),
// 			zap.Any("authenticated account id", account.ID))

// 		return nil, huma.Error403Forbidden("Cannot accept investment for a round for a business you do not own")
// 	}

// 	err = h.service.InvestmentService.ProcessInvestment(ctx, input.ID)
// 	if err != nil {
// 		h.logger.Error("failed to process investment", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("An error occurred while processing the investment")
// 	}

// 	resp := &shared.MessageResponse{}
// 	resp.Message = "Investment accepted successfully"

// 	return resp, nil
// }

// func (h *httpHandler) withdrawInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
// 	investmentResult, err := h.service.InvestmentService.GetById(ctx, input.ID)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, sql.ErrNoRows):
// 			return nil, huma.Error404NotFound("investment not found")
// 		default:
// 			h.logger.Error("failed to fetch investment", zap.Error(err))
// 			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
// 		}
// 	}

// 	if account := shared.GetAuthenticatedAccount(ctx); account.ID != investmentResult.InvestorID {
// 		h.logger.Error("input account id does not match authenticated account id",
// 			zap.Any("input account id", input.ID),
// 			zap.Any("authenticated account id", account.ID))

// 		return nil, huma.Error403Forbidden("Cannot withdraw investment for another account")
// 	}

// 	if investmentResult.Status != investment.InvestmentIntentStatusPending {
// 		return nil, huma.Error400BadRequest("Cannot withdraw investment that is not pending")
// 	}

// 	err = h.service.InvestmentService.WithdrawInvestment(ctx, input.ID)
// 	if err != nil {
// 		h.logger.Error("failed to withdraw investment", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("An error occurred while withdrawing the investment")
// 	}

// 	resp := &shared.MessageResponse{}
// 	resp.Message = "Investment withdrawn successfully"

// 	return resp, nil
// }

// func (h *httpHandler) deleteInvestment(ctx context.Context, input *shared.PathIDParam) (*shared.MessageResponse, error) {
// 	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, sql.ErrNoRows):
// 			return nil, huma.Error404NotFound("investment not found")
// 		default:
// 			h.logger.Error("failed to fetch investment", zap.Error(err))
// 			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
// 		}
// 	}

// 	if account := shared.GetAuthenticatedAccount(ctx); account.ID != investment.InvestorID {
// 		h.logger.Error("input account id does not match authenticated account id",
// 			zap.Any("input account id", input.ID),
// 			zap.Any("authenticated account id", account.ID))

// 		return nil, huma.Error403Forbidden("Cannot delete investment for another account")
// 	}

// 	err = h.service.InvestmentService.DeleteInvestment(ctx, input.ID)
// 	if err != nil {
// 		h.logger.Error("failed to delete investment", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("An error occurred while deleting the investment")
// 	}

// 	resp := &shared.MessageResponse{}
// 	resp.Message = "Investment deleted successfully"

// 	return resp, nil
// }

// func (h *httpHandler) create(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
// 	account := shared.GetAuthenticatedAccount(ctx)

// 	round, err := h.service.RoundService.GetById(ctx, input.ID)
// 	if err != nil {
// 		h.logger.Error("failed to get round", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("Failed to get round")
// 	}

// 	if account.ID == round.Venture.Business.OwnerAccountID {
// 		return nil, huma.Error400BadRequest("Business owners cannot invest in their own rounds")
// 	}

// 	isInvested, err := h.service.AccountService.IsInvestedInRound(ctx, account.ID, input.ID)
// 	if err != nil {
// 		h.logger.Error("failed to check if account is invested in round", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("An error occurred while checking if the account is invested in the round")
// 	}

// 	if isInvested {
// 		return nil, huma.Error400BadRequest("You already have a pending investment in this round, complete or withdraw that investment before creating a new one")
// 	}

// 	investment, err := h.service.InvestmentService.Create(ctx, investment.CreateInvestmentParams{
// 		RoundID:    input.ID,
// 		InvestorID: account.ID,
// 	})
// 	if err != nil {
// 		h.logger.Error("failed to create investment", zap.Error(err))
// 		return nil, huma.Error500InternalServerError("An error occurred while creating the investment")
// 	}

// 	resp := &shared.SingleInvestmentResponse{}
// 	resp.Body.Message = "Investment created successfully"
// 	resp.Body.Investment = &investment

// 	return resp, nil
// }

type GetInvestmentPaymentIntentClientSecretInput struct {
	shared.PathIDParam
}

type InvestmentPaymentIntentClientSecretOutput struct {
	Body struct {
		shared.MessageResponse
		ClientSecret string `json:"clientSecret"`
	}
}

func (h *httpHandler) createPaymentIntent(ctx context.Context, input *GetInvestmentPaymentIntentClientSecretInput) (*InvestmentPaymentIntentClientSecretOutput, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	payment, err := h.service.InvestmentService.CreatePaymentIntent(ctx, input.ID, account.ID)
	if err != nil {
		h.logger.Error("failed to create investment payment intent", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to create investment payment intent")
	}

	resp := &InvestmentPaymentIntentClientSecretOutput{}
	resp.Body.Message = "Stripe payment intent created successfully"
	resp.Body.ClientSecret = payment.ClientSecret

	return resp, nil
}

func (h *httpHandler) getInvestmentIntentById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
	investment, err := h.service.InvestmentService.GetIntentById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			h.logger.Error("investment not found", zap.Int("investment id", input.ID))
			return nil, huma.Error404NotFound("Investment not found")
		default:
			h.logger.Error("failed to fetch investment", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the investment")
		}
	}

	account := shared.GetAuthenticatedAccount(ctx)

	if account.ID != investment.InvestorID {
		h.logger.Error("input account id does not match authenticated account id",
			zap.Any("input account id", investment.InvestorID),
			zap.Any("authenticated account id", account.ID))

		return nil, huma.Error403Forbidden("Cannot fetch investment for another account")
	}

	resp := &shared.SingleInvestmentResponse{}
	resp.Body.Message = "Investment fetched successfully"
	resp.Body.Investment = &investment

	return resp, nil
}
