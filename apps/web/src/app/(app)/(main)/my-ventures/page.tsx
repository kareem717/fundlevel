import { getAccountVentures } from "@/actions/ventures"
import { VentureIndexCard } from "@/components/app/ventures/venture-index-card"
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import redirects from "@/lib/config/redirects";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // Add this line

export default async function MyVenturesPage() {
  const ventureResp = await getAccountVentures({
    cursor: 1,
    limit: 10,
  });

  const ventures = ventureResp?.data?.ventures;

  if (!ventures) {
    throw new Error(ventureResp?.serverError?.message ?? "Failed to fetch ventures");
  }

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Ventures</h1>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "flex items-center gap-2")} href={redirects.app.venture.myVentures.create}>
          <Icons.add className="h-5 w-5" />
          <span className="hidden md:inline">
            Create Venture
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center justify-between w-full h-full">
        {!!ventures?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {ventures?.map((venture) => (
              <VentureIndexCard
                key={venture.id}
                ventureId={venture.id.toString()}
                name={venture.name}
                createdAt={venture.createdAt}
                href={redirects.app.venture.myVentures.view.replace(":id", venture.id.toString())}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">No ventures found</p>
          </div>
        )}
      </div >
    </div >
  );
}