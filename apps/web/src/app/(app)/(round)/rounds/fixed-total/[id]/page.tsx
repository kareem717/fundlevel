import { getFixedTotalRoundById } from "@/actions/rounds";
import { CreateRoundInvestmentDialog } from "@/components/app/investments/create-round-investment-dialog";
import { CreateTotalRoundInvestmentForm } from "@/components/app/investments/create-total-round-investment-form"
import { notFound } from "next/navigation";

export default async function RoundPage({ params }: { params: { id: string } }) {
  const intParam = parseInt(params.id);
  if (isNaN(intParam)) {
    return <div>Invalid round ID</div>;
  }

  const roundResponse = await getFixedTotalRoundById(intParam);

  const round = roundResponse?.data;

  if (!round) {
    notFound();
  }

  return (
    <div>
      {JSON.stringify(round)}
      <CreateRoundInvestmentDialog roundId={intParam} >
        <CreateTotalRoundInvestmentForm roundId={intParam} currency={round.round.valueCurrency} />
      </CreateRoundInvestmentDialog>
    </div>
  );
}