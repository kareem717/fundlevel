package chat

import (
	"context"
	"errors"
	"fundlevel/internal/entities/chat"
	"fundlevel/internal/storage/postgres/helper"
	"fundlevel/internal/storage/shared"

	"github.com/uptrace/bun"
)

type ChatRepository struct {
	db  bun.IDB
	ctx context.Context
}

func NewChatRepository(db bun.IDB, ctx context.Context) *ChatRepository {
	return &ChatRepository{db: db, ctx: ctx}
}

func (r *ChatRepository) Create(ctx context.Context, params chat.CreateChatParams) (chat.Chat, error) {
	resp := chat.Chat{}
	err := r.db.RunInTx(ctx, nil, func(ctx context.Context, tx bun.Tx) error {
		err := tx.NewInsert().
			Model(&params).
			ModelTableExpr("chats").
			Returning("*").
			Scan(ctx, &resp)

		accountChats := []chat.AccountChat{}
		for _, accountID := range params.AccountIDs {
			accountChats = append(accountChats, chat.AccountChat{
				AccountID: accountID,
				ChatID:    resp.ID,
			})
		}

		queryResp, err := tx.NewInsert().
			Model(&accountChats).
			ModelTableExpr("account_chats").
			Exec(ctx)

		rowsAffected, err := queryResp.RowsAffected()
		if err != nil {
			return err
		}

		if rowsAffected != int64(len(accountChats)) {
			return errors.New("failed to create account chats")
		}

		return nil
	})

	return resp, err
}

func (r *ChatRepository) GetMessagesByCursor(ctx context.Context, chatID int, pagination shared.TimeCursorPagination) ([]chat.ChatMessage, error) {
	resp := []chat.ChatMessage{}
	err := r.db.NewSelect().
		Model(&resp).
		Where("chat_messages.chat_id = ?", chatID).
		Where("chat_messages.created_at <= ?", pagination.Cursor).
		OrderExpr("chat_messages.created_at DESC").
		Limit(pagination.Limit).
		Scan(ctx)

	return resp, err
}

func (r *ChatRepository) GetMessages(ctx context.Context, chatID int, filter chat.MessageFilter) ([]chat.ChatMessage, error) {
	resp := []chat.ChatMessage{}

	query := r.db.NewSelect().
		Model(&resp).
		Join("INNER JOIN chats ON chats.id = chat_message.chat_id").
		Where("chats.id = ?", chatID)

	helper.ApplyTimeRangeFilter(query, "chat_messages.created_at", filter.MinCreatedAt, filter.MaxCreatedAt)

	helper.ApplyInArrayFilter(query, "chat_messages.sender_account_id", filter.SenderAccountIDs)

	helper.ApplyInArrayFilter(query, "chat_messages.read", filter.Read)

	err := query.Scan(ctx)

	return resp, err
}

func (r *ChatRepository) DeleteChat(ctx context.Context, chatID int) error {
	_, err := r.db.NewDelete().
		Model(&chat.Chat{}).
		Where("id = ?", chatID).
		Exec(ctx)

	return err
}

func (r *ChatRepository) UpdateChat(ctx context.Context, chatID int, params chat.UpdateChatParams) (chat.Chat, error) {
	resp := chat.Chat{}

	err := r.db.NewUpdate().
		Model(&params).
		ModelTableExpr("chats").
		Where("id = ?", chatID).
		Returning("*").
		OmitZero().
		Scan(ctx, &resp)

	return resp, err
}
