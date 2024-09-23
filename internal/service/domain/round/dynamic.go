package round

import (
	"context"
	"fundlevel/internal/entities/round"
	"fundlevel/internal/storage"
	"log"
)

func (s *RoundService) CreateDynamic(ctx context.Context, params round.CreateDynamicRoundParams, roundParams round.CreateRoundParams) (round.DynamicRoundWithRound, error) {
	output := round.DynamicRoundWithRound{}

	err := s.repositories.RunInTx(ctx, func(ctx context.Context, tx storage.Transaction) error {
		round, err := tx.Round().Create(ctx, roundParams)
		if err != nil {
			return err
		}
		log.Printf("Round: %+v", round)
		output.Round = round

		params.RoundID = round.ID

		dynamic, err := tx.Round().CreateDynamic(ctx, params)
		if err != nil {
			return err
		}

		output.DynamicRound = dynamic
		return nil
	})

	return output, err
}
