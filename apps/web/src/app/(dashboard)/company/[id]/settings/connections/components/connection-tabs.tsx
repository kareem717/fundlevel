"use client";

import type {
  ComponentPropsWithoutRef,
} from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fundlevel/ui/components/tabs";
import { useQueryState } from 'nuqs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";

import { cn } from "@fundlevel/ui/lib/utils";
import { LinkQuickBooksButton } from "../../../components/link-quick-books-button";
import { LinkPlaidButton } from "../../../components/link-plaid-button";

interface ConnectionTabsProps extends ComponentPropsWithoutRef<typeof Tabs> {
  companyId: number;
}

export function ConnectionTabs({
  className,
  companyId,
  ...props
}: ConnectionTabsProps) {
  const [provider, setProvider] = useQueryState('provider',
    {
      clearOnDefault: true,
      defaultValue: 'plaid',
    },
  )
  return (
    <Tabs defaultValue={provider} onValueChange={setProvider} className={cn(className)} {...props}>
      <TabsList>
        <TabsTrigger value="plaid">Plaid</TabsTrigger>
        <TabsTrigger value="quickbooks">Quickbooks</TabsTrigger>
      </TabsList>
      <TabsContent value="plaid" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Plaid</CardTitle>
            <CardDescription>
              Link your bank account to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <LinkPlaidButton
              companyId={companyId}
              className="w-full"
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="quickbooks" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Quickbooks</CardTitle>
            <CardDescription>Link your Quickbooks account</CardDescription>
          </CardHeader>
          <CardContent>
            <LinkQuickBooksButton
              companyId={companyId}
              className="w-full"
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
