import { Icons } from "@/components/icons"
import redirects from "@/lib/config/redirects"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default async function DashboardPage({ searchParams }: { searchParams: { page: string | null, limit: string | null } }) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 10

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link className={cn(buttonVariants({ variant: "secondary" }), "flex items-center gap-2")} href="#">
          <Icons.add className="size-5" />
          <span className="hidden md:inline">
            Create Project
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-4 items-center justify-between w-full h-full">
        {/* {!!data?.waitlists.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {data?.waitlists.map((waitlist) => (
              <WaitlistIndexCard key={waitlist.id} waitlistId={waitlist.id} name={waitlist.name} createdAt={waitlist.createdAt} />
            ))}
          </div>
        ) : ( */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">No projects found</p>
          </div>
        {/* )} */}
        <Pagination className="mb-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`${redirects.app.dashboard}?page=${page - 1}&limit=${limit}`} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`${redirects.app.dashboard}?page=${page + 1}&limit=${limit}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div >
    </div >

  )
}