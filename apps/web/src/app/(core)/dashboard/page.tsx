import { getLinkedAccountsAction } from "@/actions/linked-account";
import { LinkAccountDialog } from "./components/link-account-dialog";
import { Button } from "@fundlevel/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { LinkIcon, RefreshCw } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const linkedAccounts = (await getLinkedAccountsAction())?.data || [];

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Linked Accounts</h1>
        <LinkAccountDialog />
      </div>
      {linkedAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {linkedAccounts.map((linkedAccount) => (
            <Card key={linkedAccount.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  {linkedAccount.name}
                </CardTitle>
                <CardDescription>
                  Connected on{" "}
                  {new Date(linkedAccount.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  Integration ID: {linkedAccount.id}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/accounts/${linkedAccount.id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" title="Refresh connection">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <LinkIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No accounts linked yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Connect your financial accounts to get started with FundLevel. Link
            your first account to begin tracking your finances.
          </p>
          <LinkAccountDialog />
        </div>
      )}
    </div>
  );
}
