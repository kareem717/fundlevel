package chat

import (
	"fundlevel/internal/entities/shared"

	"github.com/uptrace/bun"
)

type Chat struct {
	bun.BaseModel `bun:"table:chats"`

	shared.IntegerID
	shared.Timestamps
}

type AccountChat struct {
	bun.BaseModel `bun:"table:account_chats"`

	AccountID int `json:"accountId" minimum:"1"`
	ChatID    int `json:"chatId" minimum:"1"`
}

type CreateChatParams struct {
	AccountIDs []int `json:"accountIds" minItems:"2" maxItems:"2" minimum:"1" uniqueItems:"true"`
}
