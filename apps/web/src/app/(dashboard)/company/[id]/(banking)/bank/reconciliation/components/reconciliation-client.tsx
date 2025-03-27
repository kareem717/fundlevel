"use client";

import { useState } from "react";
import { Button } from "@fundlevel/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { Badge } from "@fundlevel/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fundlevel/ui/components/tabs";
import type { PlaidBankAccount } from "@fundlevel/db/types";
import { toast } from "@fundlevel/ui/components/sonner";
import { useQueryState, parseAsString } from "nuqs";

interface ReconciliationResult {
  matches: Array<{
    transactionId: string;
    invoiceId: string | null;
    confidence: number;
    matchReason: string;
    needsReview: boolean;
  }>;
  unmatchedTransactions: string[];
  unmatchedInvoices: string[];
  summary: {
    totalMatched: number;
    totalUnmatched: number;
    totalAmount: number;
    suggestedActions: string[];
  };
}

interface ReconciliationClientProps {
  bankAccounts: PlaidBankAccount[];
}

export function ReconciliationClient({
  bankAccounts,
}: ReconciliationClientProps) {
  const [selectedAccountId, setSelectedAccountId] = useQueryState(
    "selectedAccountId",
    parseAsString.withDefault(""),
  );

  const [results, setResults] = useState<{
    matches: Array<{
      transactionId: string;
      invoiceId: string | null;
      confidence: number;
      matchReason: string;
      needsReview: boolean;
    }>;
    unmatchedTransactions: string[];
    unmatchedInvoices: string[];
  } | null>(null);

  const handleReconcile = () => {
    if (!selectedAccountId) {
      return toast.error("No account selected", {
        description: "Please select a bank account to reconcile",
      });
    }

    toast.info("Not implemented");
  };

  const handleAccountSelection = (accountId: string) => {
    console.log("accountId", accountId);
    if (accountId === selectedAccountId) {
      setSelectedAccountId("");
    } else {
      setSelectedAccountId(accountId);
    }

    console.log("selectedAccountId", accountId);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Bank Account</CardTitle>
          <CardDescription>
            Choose a bank account to reconcile its transactions with invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {bankAccounts.length > 0 ? (
              bankAccounts.map((account) => {
                return (
                  <button
                    key={account.remoteId}
                    onClick={() => handleAccountSelection(account.remoteId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleAccountSelection(account.remoteId);
                      }
                    }}
                    tabIndex={0}
                    type="button"
                    aria-selected={selectedAccountId === account.remoteId}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAccountId === account.remoteId
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {account.name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <div className="font-medium">
                          {account.name || "Account"}
                        </div>
                        {account.mask && (
                          <div className="text-sm text-muted-foreground">
                            ****{account.mask}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center p-6 border rounded-lg text-muted-foreground">
                No bank accounts found for this company
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleReconcile}
              disabled={!selectedAccountId}
              className="w-full"
            >
              Reconcile Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
