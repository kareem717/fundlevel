"use client";

import type { PlaidBankAccount } from "@fundlevel/db/types";
import type { ComponentPropsWithoutRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fundlevel/ui/components/table";
import { Button } from "@fundlevel/ui/components/button";
import { MoreHorizontal, Building, CreditCard, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ConnectBankAccountButton } from "./connect-bank-accounts-button";
import { Avatar } from "@fundlevel/ui/components/avatar";
import { cn } from "@fundlevel/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@fundlevel/ui/components/card";
import { useState } from "react";

// Fake data for demonstration
const FAKE_BANK_ACCOUNTS: PlaidBankAccount[] = [
  {
    remoteId: "acc_12345678901",
    companyId: 1,
    name: "Chase Checking",
    mask: "4789",
    subtype: "checking",
    type: "depository",
    availableBalance: 2456.78,
    currentBalance: 2567.92,
    isoCurrencyCode: "USD",
    unofficialCurrencyCode: null,
    officialName: "Chase Total Checking",
    remainingRemoteContent: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    remoteId: "acc_23456789012",
    companyId: 1,
    name: "Chase Savings",
    mask: "7890",
    subtype: "savings",
    type: "depository",
    availableBalance: 14589.32,
    currentBalance: 14589.32,
    isoCurrencyCode: "USD",
    unofficialCurrencyCode: null,
    officialName: "Chase Savings Account",
    remainingRemoteContent: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    remoteId: "acc_34567890123",
    companyId: 1,
    name: "Bank of America Business",
    mask: "1234",
    subtype: "checking",
    type: "depository",
    availableBalance: 7821.45,
    currentBalance: 8302.0,
    isoCurrencyCode: "USD",
    unofficialCurrencyCode: null,
    officialName: "Business Advantage",
    remainingRemoteContent: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    remoteId: "acc_45678901234",
    companyId: 1,
    name: "Wells Fargo Savings",
    mask: "5678",
    subtype: "savings",
    type: "depository",
    availableBalance: 25000.0,
    currentBalance: 25000.0,
    isoCurrencyCode: "USD",
    unofficialCurrencyCode: null,
    officialName: "Way2Save Savings",
    remainingRemoteContent: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface BankAccountTableProps
  extends Omit<ComponentPropsWithoutRef<typeof Table>, "className"> {
  companyId: number;
  accounts?: PlaidBankAccount[];
  className?: string;
}

type BankAccountColumn = ColumnDef<PlaidBankAccount>[];

export function BankAccountTable({
  className,
  companyId,
  accounts = FAKE_BANK_ACCOUNTS, // Use fake data by default
  ...props
}: BankAccountTableProps) {
  const columns: BankAccountColumn = [
    {
      accessorKey: "name",
      header: "Account",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 rounded-md">
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {account.subtype === "checking" ? (
                  <CreditCard className="h-5 w-5" />
                ) : (
                  <Building className="h-5 w-5" />
                )}
              </div>
            </Avatar>
            <div>
              <div className="font-medium">{account.name}</div>
              <div className="text-sm text-muted-foreground">
                {account.mask ? `••••${account.mask}` : "••••••••"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "availableBalance",
      header: () => <div className="text-right">Available Balance</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("availableBalance") || "0");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "currentBalance",
      header: () => <div className="text-right">Current Balance</div>,
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("currentBalance") || "0");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const account = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(account.remoteId)
                  }
                >
                  Copy account ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View transactions</DropdownMenuItem>
                <DropdownMenuItem>Refresh account</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Disconnect account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: accounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Bank Accounts</CardTitle>
          <ConnectBankAccountButton companyId={companyId} />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table {...props}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No bank accounts connected.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
