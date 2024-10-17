export default function BusinessVenturePage({ params }: { params: { id: string, ventureId: string } }) {
  return (
    <div>
      Business {params.id} Venture {params.ventureId}
    </div>
  );
}
