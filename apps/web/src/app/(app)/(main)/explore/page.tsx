import { VentureIndexCard } from "@/components/app/ventures/venture-index-card"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Venture } from "@/lib/api"
import redirects from "@/lib/config/redirects"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function DashboardPage({ searchParams }: { searchParams: { page: string | null, limit: string | null } }) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10

  const ventures: Venture[] = []
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ventures</h1>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "flex items-center gap-2")} href={redirects.app.ventures.create}>
          <Icons.add className="size-5" />
          <span className="hidden md:inline">
            Create Venture
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center justify-between w-full h-full">
        {!!ventures?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {ventures?.map((venture) => (
              <VentureIndexCard key={venture.id} ventureId={venture.id.toString()} name={venture.name} createdAt={venture.createdAt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">No ventures found</p>
          </div>
        )}
        <Pagination className="mb-4">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`${redirects.app.explore}?page=${page - 1}&limit=${limit}`} />
              </PaginationItem>
            )}
            {(ventures?.length ?? 0) > limit && (
              <PaginationItem>
                <PaginationNext href={`${redirects.app.explore}?page=${page + 1}&limit=${limit}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div >
    </div >

  )
}