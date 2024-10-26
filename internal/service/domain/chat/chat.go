package chat

import (
	"context"

	"fundlevel/internal/entities/chat"
	"fundlevel/internal/storage"
)

type ChatService struct {
	repositories storage.Repository
}

// NewTestService returns a new instance of test service.
func NewChatService(repositories storage.Repository) *ChatService {
	return &ChatService{
		repositories: repositories,
	}
}

func (s *ChatService) Create(ctx context.Context, params chat.CreateChatParams) (chat.Chat, error) {
	return s.repositories.Chat().Create(ctx, params)
}

func (s *ChatService) Delete(ctx context.Context, id int) error {
	return s.repositories.Chat().Delete(ctx, id)
}

func (s *ChatService) Update(ctx context.Context, id int, params chat.UpdateChatParams) (chat.Chat, error) {
	return s.repositories.Chat().Update(ctx, id, params)
}

