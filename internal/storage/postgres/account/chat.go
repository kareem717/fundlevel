package account

import (
	"context"

	"fundlevel/internal/entities/chat"
	"fundlevel/internal/storage/shared"
)

func (r *AccountRepository) GetChatsByCursor(ctx context.Context, accountID int, pagination shared.TimeCursorPagination) ([]chat.Chat, error) {
	resp := []chat.Chat{}
	
	err := r.db.NewSelect().
		Model(&resp).
		Join("account_chats").
		Where("account_chats.account_id = ?", accountID).
		Where("chat.last_message_at <= ?", pagination.Cursor).
		OrderExpr("chat.last_message_at DESC").
		Limit(pagination.Limit).
		Scan(ctx)

	return resp, err
}
