package helper

import (
	"fmt"
	"fundlevel/internal/entities/round"
	"time"

	"github.com/uptrace/bun"
)

// ApplyTimeRangeFilter applies a time range filter to a select query.
func ApplyTimeRangeFilter(query *bun.SelectQuery, field string, min, max time.Time) {
	if !min.IsZero() {
		query.Where(fmt.Sprintf("%s >= ?", field), min)
	}

	if !max.IsZero() {
		query.Where(fmt.Sprintf("%s <= ?", field), max)
	}
}

// ApplyFloatRangeFilter applies a range filter to a select query.
func ApplyFloatRangeFilter(query *bun.SelectQuery, field string, min, max float64) {
	if min != 0 {
		query.Where(fmt.Sprintf("%s >= ?", field), min)
	}

	if max != 0 {
		query.Where(fmt.Sprintf("%s <= ?", field), max)
	}
}

// ApplyIntRangeFilter applies a range filter to a select query.
func ApplyIntRangeFilter(query *bun.SelectQuery, field string, min, max int) {
	ApplyFloatRangeFilter(query, field, float64(min), float64(max))
}

func ApplyEqualFilter(query *bun.SelectQuery, field string, value any) {
	query.Where(fmt.Sprintf("%s = ?", field), value)
}

func ApplyRoundFilter(query *bun.SelectQuery, filter round.RoundFilter) *bun.SelectQuery {
	ApplyTimeRangeFilter(
		query, "round.begins_at",
		filter.MinimumBeginsAt, filter.MaximumBeginsAt,
	)

	ApplyTimeRangeFilter(
		query, "round.ends_at",
		filter.MinimumEndsAt, filter.MaximumEndsAt,
	)

	ApplyFloatRangeFilter(
		query, "round.percentage_offered",
		filter.MinimumPercentageOffered, filter.MaximumPercentageOffered,
	)

	ApplyIntRangeFilter(
		query, "round.percentage_value",
		filter.MinimumPercentageValue, filter.MaximumPercentageValue,
	)

	ApplyIntRangeFilter(
		query, "round.investor_count",
		filter.MinimumInvestorCount, filter.MaximumInvestorCount,
	)

	ApplyFloatRangeFilter(
		query, "round.buy_in",
		filter.MinimumBuyIn, filter.MaximumBuyIn,
	)

	if len(filter.Status) > 0 {
		query.Where("round.status IN (?)", bun.In(filter.Status))
	}

	if filter.ValueCurrencies != "" {
		query.Where("round.value_currency = ?", filter.ValueCurrencies)
	}

	if filter.SortBy != "" {
		query.OrderExpr(fmt.Sprintf("%s, round.id %s", filter.SortBy, filter.SortOrder))
	} else {
		query.Order("round.id")
	}

	return query
}
