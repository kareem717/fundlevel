export default function BusinessInvestmentPage({ params }: { params: { id: string, investmentId: string } }) {
  return (
    <div>
      Business {params.id}
      Investment {params.investmentId}
    </div>
  );
}
