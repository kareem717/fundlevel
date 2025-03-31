"use client";

import type { ComponentPropsWithoutRef } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fundlevel/ui/components/tabs";
import { parseAsStringEnum, useQueryState } from "nuqs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { cn } from "@fundlevel/ui/lib/utils";
import { ConnectQuickBooksButton } from "./connect-quickbooks-button";
import { Badge } from "@fundlevel/ui/components/badge";
import { AlertCircle, Building, BookOpen, Coins, FileText, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@fundlevel/ui/components/button";
import { XeroIcon } from "@fundlevel/web/components/icons";
import { useTheme } from "next-themes";
import { ConnectBankAccountButton } from "./connect-bank-accounts-button";
import { Separator } from "@fundlevel/ui/components/separator";

interface ConnectionTabsProps extends ComponentPropsWithoutRef<typeof Tabs> {
  companyId: number;
}

enum ConnectionProvider {
  ACCOUNTING = "accounting",
  BANKING = "banking",
}

export function ConnectionTabs({
  className,
  companyId,
  ...props
}: ConnectionTabsProps) {
  const [provider, setProvider] = useQueryState(
    "provider",
    parseAsStringEnum<ConnectionProvider>(Object.values(ConnectionProvider))
      .withDefault(ConnectionProvider.ACCOUNTING)
      .withOptions({
        clearOnDefault: true,
      }),
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connections</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your financial accounts to streamline reconciliation
        </p>
      </div>
      <Tabs
        defaultValue={provider}
        onValueChange={(value) => setProvider(value as ConnectionProvider)}
        className="w-full"
        {...props}
      >
        <TabsList className="w-full sm:w-auto justify-start">
          <TabsTrigger value="accounting" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Accounting
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Banking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banking" className="mt-8">
          <Card className="overflow-hidden border relative">
            <div className="flex justify-between items-center border-t bg-muted/30 absolute top-0 left-0 text-sm text-muted-foreground gap-2 w-full p-6">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Banking Connections</h3>
              </div>
              <Badge variant={isDark ? "default" : "secondary"} className="px-2 py-1 h-auto">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Recommended
                </div>
              </Badge>
            </div>
            <CardContent className="px-6 py-6 my-10">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium tracking-tight">Link your bank accounts for transaction data</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect your bank accounts to automatically import transactions for reconciliation
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Coins className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium">Real-time banking data</h3>
                      <p className="text-sm text-muted-foreground">Connect to view all your transactions in one place</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-medium">Automated reconciliation</h3>
                      <p className="text-sm text-muted-foreground">Match transactions with invoices to keep your books accurate</p>
                    </div>
                  </div>
                </div>

                <ConnectBankAccountButton companyId={companyId} />
              </div>
            </CardContent>

            <CardFooter className="flex justify-center items-center border-t bg-muted/30 absolute bottom-0 left-0 text-sm text-muted-foreground gap-2 w-full pb-4">
              <HelpCircle className="h-3 w-3" />
              <span>We use Plaid to securely connect your bank accounts</span>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="accounting" className="mt-8">
          <Card className="overflow-hidden border relative">
            <div className="flex justify-between items-center bg-muted/30 absolute top-0 left-0 text-sm text-muted-foreground gap-2 w-full p-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Accounting Software</h3>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <span>2 Options</span>
              </Badge>
            </div>

            <CardContent className="px-6 py-6 my-10">
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-medium tracking-tight">Connect your accounting software</h4>
                <p className="text-sm text-muted-foreground">
                  Import your invoices and accounting data to make reconciliation faster and more accurate
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col h-full border-2 border-primary/20 hover:border-primary/50 transition-colors rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-muted/30 px-4 py-3">
                    <h3 className="font-medium">QuickBooks Online</h3>
                    <p className="text-xs text-muted-foreground">Import invoices and transactions</p>
                  </div>
                  <div className="p-6 flex-1 flex items-center justify-center">
                    <ConnectQuickBooksButton
                      companyId={companyId}
                      variant={isDark ? "default" : "secondary"}
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
                    <Badge variant={isDark ? "default" : "secondary"} className="h-5">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                  <div className="p-6 flex-1 flex items-center justify-center">
                    <Button className="w-full h-16" variant="outline" disabled>
                      <div className="flex items-center justify-center">
                        <XeroIcon className="h-8 w-8 opacity-70" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
