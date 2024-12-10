package investment

import (
	"context"
	"database/sql"
	"errors"
	"fundlevel/internal/entities/investment"
	"fundlevel/internal/entities/round"
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

// 	if investmentResult.Status != investment.InvestmentStatusPending {
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

// 	if investmentResult.Status != investment.InvestmentStatusPending {
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
// }.

func (h *httpHandler) create(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
	account := shared.GetAuthenticatedAccount(ctx)

	// todo: add ABAC checks
	roundRecord, err := h.service.RoundService.GetById(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to get round", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to get round")
	}

	if roundRecord.Status != round.RoundStatusActive {
		h.logger.Error("round is not active", zap.Int("round id", input.ID))
		return nil, huma.Error400BadRequest("Round is not active")
	}

	investment, err := h.service.InvestmentService.Create(ctx, account.ID, &roundRecord.Round)
	if err != nil {
		h.logger.Error("failed to create investment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while creating the investment")
	}

	resp := &shared.SingleInvestmentResponse{}
	resp.Body.Message = "Investment created successfully"
	resp.Body.Investment = &investment

	return resp, nil
}

type GetInvestmentPaymentIntentClientSecretInput struct {
	shared.PathIDParam
}

type InvestmentPaymentIntentClientSecretOutput struct {
	Body struct {
		shared.MessageResponse
		ClientSecret string `json:"clientSecret"`
	}
}

func (h *httpHandler) createStripePaymentIntent(ctx context.Context, input *GetInvestmentPaymentIntentClientSecretInput) (*InvestmentPaymentIntentClientSecretOutput, error) {
	// account := shared.GetAuthenticatedAccount(ctx)
	//todo: add ABAC checks

	// just checking if the investment exists, arguably costly
	investmentRecord, err := h.service.InvestmentService.GetById(ctx, input.ID)
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

	if investmentRecord.TermsCompletedAt == nil {
		h.logger.Error("investment terms are not completed", zap.Int("investment id", input.ID))
		return nil, huma.Error400BadRequest("Investment terms are not completed")
	}

	if investmentRecord.Status != investment.InvestmentStatusTerms {
		h.logger.Error("investment status is not terms",
			zap.Int("investment id", input.ID),
			zap.String("status", string(investmentRecord.Status)))
		return nil, huma.Error400BadRequest("Investment is not in the correct state to create a payment intent")
	}

	payment, err := h.service.InvestmentService.CreateStripePaymentIntent(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to create investment payment intent", zap.Error(err))
		return nil, huma.Error500InternalServerError("Failed to create investment payment intent")
	}

	resp := &InvestmentPaymentIntentClientSecretOutput{}
	resp.Body.Message = "Stripe payment intent created successfully"
	resp.Body.ClientSecret = payment.ClientSecret

	return resp, nil
}

func (h *httpHandler) getInvestmentById(ctx context.Context, input *shared.PathIDParam) (*shared.SingleInvestmentResponse, error) {
	investment, err := h.service.InvestmentService.GetById(ctx, input.ID)
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

type GetInvestmentPaymentsOutput struct {
	Body struct {
		shared.MessageResponse
		InvestmentPayments []investment.InvestmentPayment `json:"investmentPayments"`
	}
}

func (h *httpHandler) getInvestmentPayments(ctx context.Context, input *shared.PathIDParam) (*GetInvestmentPaymentsOutput, error) {
	//todo: add ABAC checks

	payments, err := h.service.InvestmentService.GetPayments(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to fetch investment payments", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment payments")
	}

	resp := &GetInvestmentPaymentsOutput{}
	resp.Body.Message = "Investment payments fetched successfully"
	resp.Body.InvestmentPayments = payments

	return resp, nil
}

type GetInvestmentActivePaymentOutput struct {
	Body struct {
		shared.MessageResponse
		InvestmentPayment investment.InvestmentPayment `json:"investmentPayment"`
	}
}

func (h *httpHandler) getInvestmentActivePayment(ctx context.Context, input *shared.PathIDParam) (*GetInvestmentActivePaymentOutput, error) {
	payment, err := h.service.InvestmentService.GetCurrentPayment(ctx, input.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			h.logger.Error("investment active payment not found", zap.Int("investment id", input.ID))
			return nil, huma.Error404NotFound("Investment does not have an active payment")
		}

		h.logger.Error("failed to fetch investment active payment", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while fetching the investment active payment")
	}

	resp := &GetInvestmentActivePaymentOutput{}
	resp.Body.Message = "Investment active payment fetched successfully"
	resp.Body.InvestmentPayment = payment

	return resp, nil
}
