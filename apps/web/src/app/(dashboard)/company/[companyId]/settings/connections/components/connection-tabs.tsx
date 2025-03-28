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
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { cn } from "@fundlevel/ui/lib/utils";
import { ConnectQuickBooksButton } from "./connect-quickbooks-button";
import { Badge } from "@fundlevel/ui/components/badge";
import { Sparkles } from "lucide-react";
import { Button } from "@fundlevel/ui/components/button";
import { XeroIcon } from "@fundlevel/web/components/icons";
import { useTheme } from "next-themes";
import { ConnectBankAccountButton } from "./connect-bank-accounts-button";
import { BankAccountTable } from "./bank-account-table";

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

  return (
    <Tabs
      defaultValue={provider}
      onValueChange={(value) => setProvider(value as ConnectionProvider)}
      className={cn(className)}
      {...props}
    >
      <TabsList className="w-full justify-start">
        <TabsTrigger value="accounting">Accounting</TabsTrigger>
        <TabsTrigger value="banking">Banking</TabsTrigger>
      </TabsList>
      <TabsContent value="banking" className="space-y-4 mt-4">
        <BankAccountTable companyId={companyId} />
      </TabsContent>
      <TabsContent value="accounting" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Accounting</CardTitle>
            <CardDescription>Link your accounting software</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 w-full [&>*]:h-40">
            <ConnectQuickBooksButton
              companyId={companyId}
              variant={resolvedTheme === "light" ? "secondary" : "default"}
            />
            <div className="relative">
              <Button className="h-full w-full" variant="secondary" disabled>
                <XeroIcon className="size-40" />
              </Button>
              <Badge
                className="absolute -top-2 -right-2"
                variant={resolvedTheme === "light" ? "secondary" : "default"}
              >
                <Sparkles className="size-4" />
                Coming Soon...
              </Badge>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
