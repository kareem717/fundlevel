export default function BusinessRoundPage({ params }: { params: { id: string, roundId: string } }) {
  return (
    <div>
      Business {params.id} Round {params.roundId}
    </div>
  );
}
