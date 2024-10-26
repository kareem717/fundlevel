package chat

import (
	"fundlevel/internal/entities/shared"
	"time"

	"github.com/uptrace/bun"
)

type ChatMessage struct {
	bun.BaseModel   `bun:"table:chat_messages"`
	SenderAccountID int        `json:"senderAccountId" minimum:"1"`
	ChatID          int        `json:"chatId" minimum:"1"`
	Content         string     `json:"content" minLength:"1" maxLength:"1000"`
	ReadAt          *time.Time `json:"readAt" format:"date-time"`
	shared.IntegerID
	shared.Timestamps
}
