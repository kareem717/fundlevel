package offer

import (
	"context"
	"database/sql"
	"errors"

	"fundlevel/internal/entities/offer"
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

type SingleOfferResponse struct {
	Body struct {
		shared.MessageResponse
		Offer *offer.Offer `json:"offer"`
	}
}

func (h *httpHandler) getByID(ctx context.Context, input *shared.PathIDParam) (*SingleOfferResponse, error) {
	offer, err := h.service.OfferService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("offer not found")
		default:
			h.logger.Error("failed to fetch offer", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the offer")
		}
	}

	resp := &SingleOfferResponse{}
	resp.Body.Message = "Offer fetched successfully"
	resp.Body.Offer = &offer

	return resp, nil
}

type UpdateOfferInput struct {
	shared.PathIDParam
	Body offer.UpdateOfferParams `json:"offer"`
}

func (i *UpdateOfferInput) Resolve(ctx huma.Context) []error {
	//TODO: implement db checks
	return nil
}

func (h *httpHandler) updateStatus(ctx context.Context, input *UpdateOfferInput) (*SingleOfferResponse, error) {
	_, err := h.service.OfferService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("offer not found")
		default:
			h.logger.Error("failed to fetch offer", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the offer")
		}
	}

	offer, err := h.service.OfferService.UpdateStatus(ctx, input.ID, input.Body.Status)

	if err != nil {
		h.logger.Error("failed to update offer", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while updating the offer")
	}

	resp := &SingleOfferResponse{}
	resp.Body.Message = "Offer updated successfully"
	resp.Body.Offer = &offer

	return resp, nil
}

type DeleteOfferOutput struct {
	Body shared.MessageResponse
}

func (h *httpHandler) delete(ctx context.Context, input *shared.PathIDParam) (*DeleteOfferOutput, error) {
	_, err := h.service.OfferService.GetById(ctx, input.ID)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, huma.Error404NotFound("offer not found")
		default:
			h.logger.Error("failed to fetch offer", zap.Error(err))
			return nil, huma.Error500InternalServerError("An error occurred while fetching the offer")
		}
	}

	err = h.service.OfferService.Delete(ctx, input.ID)
	if err != nil {
		h.logger.Error("failed to delete offer", zap.Error(err))
		return nil, huma.Error500InternalServerError("An error occurred while deleting the offer")
	}

	resp := &DeleteOfferOutput{}
	resp.Body.Message = "Offer deleted successfully"

	return resp, nil
}
