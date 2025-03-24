import { client } from "@fundlevel/sdk";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { redirect } from "next/navigation";
import { getTokenCached } from "@fundlevel/web/actions/auth";
import Link from "next/link";
import { buttonVariants } from "@fundlevel/ui/components/button";
import { cn } from "@fundlevel/ui/lib/utils";
import { env } from "@fundlevel/web/env";
export default async function JournalEntriesPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const companyId = Number.parseInt(id, 10);
  const token = await getTokenCached();
  if (!token) {
    return redirect(redirects.auth.login)
  }

  const req = await client(env.NEXT_PUBLIC_BACKEND_URL, token).accounting.companies[":companyId"]["journal-entries"].$get({ param: { companyId } });
  if (!req.ok) {
    throw new Error("Failed to get journal entries")
  }

  const journalEntries = await req.json();

  return (
    <div>
      <h1>Journal Entries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {journalEntries.length > 0 ? (
          journalEntries.map((journalEntry) => (
            <pre
              key={journalEntry.id}
              className="bg-muted p-4 rounded-md gap-4 flex flex-col overflow-hidden"
            >
              {JSON.stringify(journalEntry, null, 2)}
              <Link
                href={redirects.app
                  .company(companyId)
                  .accounting.journalEntry(journalEntry.id.toString())}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                View Journal Entry
              </Link>
            </pre>
          ))
        ) : (
          <p className="text-muted-foreground">No journal entries found</p>
        )}
      </div>
    </div>
  )
} 