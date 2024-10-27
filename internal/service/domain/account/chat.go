package account

import (
	"context"
	"time"

	"fundlevel/internal/entities/chat"
	postgres "fundlevel/internal/storage/shared"
)

func (s *AccountService) GetChatsByCursor(ctx context.Context, accountID int, limit int, cursor time.Time) ([]chat.Chat, error) {
	pagination := postgres.TimeCursorPagination{
		Limit:  limit,
		Cursor: cursor,
	}

	return s.repositories.Account().GetChatsByCursor(ctx, accountID, pagination)
}
