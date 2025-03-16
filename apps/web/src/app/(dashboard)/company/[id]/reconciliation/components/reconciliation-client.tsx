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
import { reconcileTransactionsAction } from "@/actions/ai";
import { Loader2 } from "lucide-react";
import { Badge } from "@fundlevel/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fundlevel/ui/components/tabs";
import type { BankAccount } from "@fundlevel/api/types";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@fundlevel/ui/hooks/use-toast";

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
  companyId: number;
  bankAccounts: BankAccount[];
}

export function ReconciliationClient({
  companyId,
  bankAccounts
}: ReconciliationClientProps) {
  const [results, setResults] = useState<ReconciliationResult | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<number | undefined>();
  const [isExecutingReconcile, setIsExecutingReconcile] = useState(false);
  const { toast } = useToast();

  const { execute: reconcile, isExecuting } = useAction(
    reconcileTransactionsAction,
    {
      onSuccess: (result) => {
        // if (result?.data) {
        //   setResults(result.data);
        // }
        toast({
          title: "Reconciliation successful",
          description: "Transactions reconciled successfully",
        });
        setIsExecutingReconcile(false);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Reconciliation failed",
          description: error.error.serverError?.message || "An error occurred",
        });
        setIsExecutingReconcile(false);
      },
    }
  );

  const handleReconcile = () => {
    if (!selectedAccountId) {
      toast({
        variant: "destructive",
        title: "No account selected",
        description: "Please select a bank account to reconcile",
      });
      return;
    }

    setIsExecutingReconcile(true);
    reconcile(selectedAccountId);
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
                const content = JSON.parse(account.content as string);
                return (
                  <div
                    key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAccountId === account.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {content.name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="font-medium">{content.name || "Account"}</div>
                      {content.mask && (
                        <div className="text-sm text-muted-foreground">****{content.mask}</div>
                      )}
                    </div>
                  </div>
                </div>
                )
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
              disabled={isExecutingReconcile || !selectedAccountId}
              className="w-full sm:w-auto"
            >
              {isExecutingReconcile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reconciling...
                </>
              ) : (
                "Reconcile Transactions"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-2xl font-bold">
                      {results.summary.totalMatched}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Matched Transactions
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-2xl font-bold">
                      {results.summary.totalUnmatched}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Unmatched Items
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                    <span className="text-2xl font-bold">
                      ${results.summary.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Total Amount
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Suggested Actions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.summary.suggestedActions.map((action) => (
                      <li key={action} className="text-sm">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="matches">
            <TabsList className="mb-4">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="unmatched">Unmatched Items</TabsTrigger>
            </TabsList>

            <TabsContent value="matches">
              <Card>
                <CardHeader>
                  <CardTitle>Matched Transactions</CardTitle>
                  <CardDescription>
                    Transactions that have been matched to invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.matches.map((match) => (
                      <div
                        key={match.transactionId}
                        className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              Transaction: {match.transactionId}
                            </span>
                            {match.needsReview && (
                              <Badge
                                variant="outline"
                                className="bg-yellow-100"
                              >
                                Needs Review
                              </Badge>
                            )}
                          </div>
                          {match.invoiceId && (
                            <div className="text-sm text-muted-foreground">
                              Matched to Invoice: {match.invoiceId}
                            </div>
                          )}
                          <div className="text-sm mt-1">
                            {match.matchReason}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              match.confidence > 80
                                ? "bg-green-100 text-green-800"
                                : match.confidence > 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            Confidence: {match.confidence}%
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {results.matches.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No matched transactions found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unmatched">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Unmatched Transactions</CardTitle>
                    <CardDescription>
                      Transactions with no matching invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.unmatchedTransactions.map((transactionId) => (
                        <div
                          key={transactionId}
                          className="p-3 border rounded-lg"
                        >
                          {transactionId}
                        </div>
                      ))}

                      {results.unmatchedTransactions.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          No unmatched transactions
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Unmatched Invoices</CardTitle>
                    <CardDescription>
                      Invoices with no matching transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.unmatchedInvoices.map((invoiceId) => (
                        <div key={invoiceId} className="p-3 border rounded-lg">
                          {invoiceId}
                        </div>
                      ))}

                      {results.unmatchedInvoices.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          No unmatched invoices
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
}
