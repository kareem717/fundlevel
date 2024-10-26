package account

import (
	"context"

	"fundlevel/internal/entities/chat"
	postgres "fundlevel/internal/storage/shared"
)

func (s *AccountService) GetChatsByCursor(ctx context.Context, accountID int, pagination postgres.TimeCursorPagination) ([]chat.Chat, error) {
	return s.repositories.Account().GetChatsByCursor(ctx, accountID, pagination)
}
