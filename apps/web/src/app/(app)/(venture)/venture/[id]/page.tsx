import { notFound } from "next/navigation"

export default async function VenturePage({ params }: { params: { id: string } }) {
  // try to parse venture id as numbver
  const ventureId = Number(params.id)
  if (isNaN(ventureId)) {
    throw notFound()
  }

  return <div>Venture</div>
}