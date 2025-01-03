package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

type SimplifiedDailyAggregatedBusinessAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_business_analytics"`
	DayOfYear               int `json:"dayOfYear" min:"1" max:"366"`
	ImpressionsCount        int `json:"impressionsCount" min:"0"`
	UniquesImpressionsCount int `json:"uniquesImpressionsCount" min:"0"`
	FavouritedCount         int `json:"favouritedCount" min:"0"`
}

type DailyAggregatedBusinessAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_business_analytics"`
	BusinessID    int `json:"businessId" min:"1"`
	SimplifiedDailyAggregatedBusinessAnalytics
	CreatedAt time.Time `json:"createdAt"`
}

type SimplifiedDailyAggregatedRoundAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_round_analytics"`
	DayOfYear               int `json:"dayOfYear" min:"1" max:"366"`
	ImpressionsCount        int `json:"impressionsCount" min:"0"`
	UniquesImpressionsCount int `json:"uniquesImpressionsCount" min:"0"`
	FavouritedCount         int `json:"favouritedCount" min:"0"`
}

type DailyAggregatedRoundAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_round_analytics"`
	RoundID       int `json:"roundId" min:"1"`
	SimplifiedDailyAggregatedRoundAnalytics
	CreatedAt time.Time `json:"createdAt"`
}
