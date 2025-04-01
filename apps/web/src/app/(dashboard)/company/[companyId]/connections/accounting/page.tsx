import { Badge } from "@fundlevel/ui/components/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@fundlevel/ui/components/card";
import { BookOpen, Sparkles } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Button } from "@fundlevel/ui/components/button";
import { XeroIcon } from "@fundlevel/web/components/icons";
import { ConnectQuickBooksButton } from "./components/connect-quickbooks-button";

export default async function ConnectionsSettingsPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  return (
    <Card className="overflow-hidden border relative">
      <CardHeader >
        <CardTitle>Accounting Software</CardTitle>
        <CardDescription>Connect your accounting software to automatically import invoices and transactions</CardDescription>
      </CardHeader>
      <CardContent className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col h-full border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-4 py-3">
              <h3 className="font-medium">QuickBooks Online</h3>
              <p className="text-xs text-muted-foreground">Import invoices and transactions</p>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center">
              <ConnectQuickBooksButton
                companyId={parsedId}
                className="w-full h-16"
                showText
              />
            </div>
          </div>

          <div className="flex flex-col h-full border border-dashed rounded-lg overflow-hidden opacity-80">
            <div className="bg-muted/30 px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="font-medium">Xero</h3>
                <p className="text-xs text-muted-foreground">Connect to Xero accounting</p>
              </div>
              <Badge variant={"secondary"} className="h-5">
                <Sparkles className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center">
              <Button className="w-full h-16" disabled>
                <div className="flex items-center justify-center">
                  <XeroIcon className="size-9 border-current rounded-full bg-current" />
                  <span className="ml-2">Connect Xero</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center border-t bg-muted/30 absolute bottom-0 left-0 text-sm text-muted-foreground gap-2 w-full pb-4">
        <AlertCircle className="h-4 w-4" />
        <span>Don't see your accounting software? Let us know!</span>
      </CardFooter>
    </Card>
  );
}
