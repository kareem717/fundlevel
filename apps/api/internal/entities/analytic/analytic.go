package analytic

import (
	"time"

	"github.com/uptrace/bun"
)

type SimplifiedDailyAggregatedBusinessAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_business_analytics"`
	DayOfYear               int `json:"day_of_year" min:"1" max:"366"`
	ImpressionsCount        int `json:"impressions_count" min:"0"`
	UniquesImpressionsCount int `json:"uniques_impressions_count" min:"0"`
	FavouritedCount         int `json:"favourited_count" min:"0"`
}

type DailyAggregatedBusinessAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_business_analytics"`
	BusinessID    int `json:"business_id" min:"1"`
	SimplifiedDailyAggregatedBusinessAnalytics
	CreatedAt time.Time `json:"created_at"`
}

type SimplifiedDailyAggregatedRoundAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_round_analytics"`
	DayOfYear               int `json:"day_of_year" min:"1" max:"366"`
	ImpressionsCount        int `json:"impressions_count" min:"0"`
	UniquesImpressionsCount int `json:"uniques_impressions_count" min:"0"`
	FavouritedCount         int `json:"favourited_count" min:"0"`
}

type DailyAggregatedRoundAnalytics struct {
	bun.BaseModel `bun:"daily_aggregated_round_analytics"`
	RoundID       int `json:"round_id" min:"1"`
	SimplifiedDailyAggregatedRoundAnalytics
	CreatedAt time.Time `json:"created_at"`
}
