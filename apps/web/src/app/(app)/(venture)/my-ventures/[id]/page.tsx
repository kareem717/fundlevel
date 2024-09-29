import { getVentureById } from "@/actions/ventures";
import { notFound } from "next/navigation";

export default async function VenturePage({ params }: { params: { id: string } }) {
  //try to parse id as a number
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw notFound();
  }

  const ventureRes = await getVentureById(id);
  const venture = ventureRes?.data?.data.venture
  const error = ventureRes?.serverError

  if (!venture) {
    if (error) {
      if (error.statusCode === 404) {
        throw notFound();
      } else {
        throw new Error(error.message);
      }
    }

    throw new Error("Failed to fetch venture");
  }

  return (
    <div>
      {JSON.stringify(venture)}
    </div>
  )
}