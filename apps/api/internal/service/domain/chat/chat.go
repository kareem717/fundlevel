package chat

import (
	"context"
	"database/sql"
	"errors"

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
	_, err := s.repositories.Chat().GetChatByAccountIds(ctx, params.CreatedByAccountID, params.CreatedForAccountID)
	if err != nil {
		if err == sql.ErrNoRows {
			return s.repositories.Chat().Create(ctx, params)
		}

		return chat.Chat{}, err
	}

	return chat.Chat{}, errors.New("chat already exists")
}

func (s *ChatService) Delete(ctx context.Context, id int) error {
	return s.repositories.Chat().Delete(ctx, id)
}

func (s *ChatService) Update(ctx context.Context, id int, params chat.UpdateChatParams) (chat.Chat, error) {
	return s.repositories.Chat().Update(ctx, id, params)
}

func (s *ChatService) GetChatById(ctx context.Context, id int) (chat.Chat, error) {
	return s.repositories.Chat().GetById(ctx, id)
}

func (s *ChatService) IsAccountInChat(ctx context.Context, chatID int, accountID int) (bool, error) {
	return s.repositories.Chat().IsAccountInChat(ctx, chatID, accountID)
}
