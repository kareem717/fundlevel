import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { Building, HelpCircle, Coins, FileText } from "lucide-react";
import { ConnectBankAccountButton } from "./components/connect-bank-accounts-button";

export default async function ConnectionsSettingsPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  return (
    <Card className="overflow-hidden border relative">
      <CardHeader>
        <CardTitle>Banking Software</CardTitle>
        <CardDescription>
          Connect your banking software to automatically import transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="mb-16">
        <div className="grid gap-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Coins className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium">
                  Real-time banking data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect to view all your transactions in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-full p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-medium">
                  Automated reconciliation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Match transactions with invoices to keep your books accurate
                </p>
              </div>
            </div>
          </div>

          <ConnectBankAccountButton companyId={parsedId} />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center items-center border-t bg-muted/30 absolute bottom-0 left-0 text-sm text-muted-foreground gap-2 w-full pb-4">
        <HelpCircle className="h-3 w-3" />
        <span>We use Plaid to securely connect your bank accounts</span>
      </CardFooter>
    </Card>
  );
}
