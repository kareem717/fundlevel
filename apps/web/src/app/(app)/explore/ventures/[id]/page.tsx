import { notFound } from "next/navigation";
import { getVentureById } from "@/actions/ventures";

export default async function VentureViewPage({ params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id as string || ""); // Parse the id
  if (isNaN(parsedId)) {
    notFound();
  }

  const ventureResp = await getVentureById(parsedId)
  if (!ventureResp?.data || ventureResp?.serverError) {
    console.error(ventureResp)
    throw new Error("Something went wrong")
  }

  const venture = ventureResp.data.venture

  return (
    <div className="h-full max-h-screen w-full max-w-screen-lg relative">
      <div className="w-full h-full flex flex-col md:grid grid-cols-1 md:grid-cols-3 grid-rows-3 gap-4 ">
        {JSON.stringify(venture)}
      </div>
    </div>
  )
}