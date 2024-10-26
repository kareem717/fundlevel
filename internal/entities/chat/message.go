package chat

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type ChatMessage struct {
	bun.BaseModel   `bun:"table:chat_messages"`
	SenderAccountID int `json:"senderAccountId" minimum:"1"`
	UpdateChatParams
	shared.IntegerID
	shared.Timestamps
}

type CreateMessageParams struct {
	ChatID          int    `json:"chatId" minimum:"1"`
	Content         string `json:"content" minLength:"1" maxLength:"1000"`
	SenderAccountID int    `json:"senderAccountId" minimum:"1"`
}

type UpdateMessageParams struct {
	Content string     `json:"content" minLength:"1" maxLength:"1000"`
	ReadAt  *time.Time `json:"readAt" format:"date-time"`
}

type MessageFilter struct {
	SenderAccountIDs []int     `json:"senderAccountIds" minItems:"1" maxItems:"2" uniqueItems:"true" minimum:"1" required:"false"`
	Read             []bool    `json:"read" uniqueItems:"true" minItems:"1" maxItems:"2" required:"false"`
	MinCreatedAt     time.Time `json:"minCreatedAt" format:"date-time" required:"false"`
	MaxCreatedAt     time.Time `json:"maxCreatedAt" format:"date-time" required:"false"`
}
