
import { VentureRoundsTable } from "@/components/app/ventures/venture-rounds-table";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Round } from "@/lib/api";
import redirects from "@/lib/config/redirects";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VentureRoundsPage({ params }: { params: { id: string } }) {
  //parse as number
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw notFound()
  }

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-2xl font-bold">
          Rounds
        </h1>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "flex flex-row gap-2")} href={redirects.app.venture.myVentures.create}>
          <Icons.add className="h-5 w-5" />
          Create Round
        </Link>
      </div>
      <VentureRoundsTable rounds={[]} />
    </div>
  )
}