"use client";

import type { BankTransaction } from "@fundlevel/db/types";
import { Button } from "@fundlevel/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import { formatCurrency } from "@fundlevel/web/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<
  Omit<BankTransaction, "remainingRemoteContent">
>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row: { original: tx } }) => {
      return formatCurrency(tx.amount);
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row: { original: tx } }) => {
      return format(tx.date, "MM/dd/yyyy");
    },
  },
  {
    accessorKey: "merchantName",
    header: "Merchant",
    cell: ({ row: { original: tx } }) => {
      const merchantName = tx.merchantName || "N/A";
      return merchantName;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original: tx } }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(tx.remoteId);
              }}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(tx, null, 2));
              }}
            >
              Copy JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
