package round

import (
	"context"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage"
)

func (s *RoundService) CreateStatic(ctx context.Context, params round.CreateStaticRoundParams, roundParams round.CreateRoundParams) (round.StaticRoundWithRound, error) {
	output := round.StaticRoundWithRound{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		round, err := tx.Round().Create(ctx, roundParams)
		if err != nil {
			return err
		}
		output.Round = round

		params.RoundID = round.ID
		static, err := tx.Round().CreateStatic(ctx, params)
		if err != nil {
			return err
		}

		output.StaticRound = static
		return nil
	})

	return output, err
}
