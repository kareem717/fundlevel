package chat

import (
	"fundlevel/internal/server/middleware"
	"fundlevel/internal/service"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
)

func RegisterHumaRoutes(
	service *service.Service,
	logger *zap.Logger,
	humaApi huma.API,
	supabaseClient *supabase.Client,
) {
	handler := newHTTPHandler(service, logger)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-chat",
		Method:      http.MethodPost,
		Path:        "/chat",
		Summary:     "Create a chat",
		Description: "Create a chat.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.createChat)

	huma.Register(humaApi, huma.Operation{
		OperationID: "create-chat-message",
		Method:      http.MethodPost,
		Path:        "/chat/{id}/messages",
		Summary:     "Create a chat message",
		Description: "Create a chat message.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.createChatMessage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-chat",
		Method:      http.MethodDelete,
		Path:        "/chat/{id}",
		Summary:     "Delete a chat",
		Description: "Delete a chat.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.deleteChat)

	huma.Register(humaApi, huma.Operation{
		OperationID: "get-chat-messages",
		Method:      http.MethodGet,
		Path:        "/chat/{id}/messages",
		Summary:     "Get chat messages",
		Description: "Get chat messages.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.getChatMessages)

	huma.Register(humaApi, huma.Operation{
		OperationID: "delete-chat-message",
		Method:      http.MethodDelete,
		Path:        "/chat/message/{id}",
		Summary:     "Delete a chat message",
		Description: "Delete a chat message.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.deleteChatMessage)

	huma.Register(humaApi, huma.Operation{
		OperationID: "update-chat-message",
		Method:      http.MethodPut,
		Path:        "/chat/message/{id}",
		Summary:     "Update a chat message",
		Description: "Update a chat message.",
		Tags:        []string{"Chat"},
		Security: []map[string][]string{
			{"bearerAuth": {}},
		},
		Middlewares: huma.Middlewares{
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithUser(humaApi)(ctx, next, logger, supabaseClient)
			},
			func(ctx huma.Context, next func(huma.Context)) {
				middleware.WithAccount(humaApi)(ctx, next, logger, service)
			},
		},
	}, handler.updateChatMessage)

}
