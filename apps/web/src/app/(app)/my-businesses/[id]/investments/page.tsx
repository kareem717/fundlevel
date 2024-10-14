export default function BusinessInvestmentsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      Business {params.id} Investments
    </div>
  );
}
