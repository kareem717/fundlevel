"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransaction } from "@fundlevel/db/types";
import { formatCurrency } from "@fundlevel/web/lib/utils";

export const transactionColumns: ColumnDef<
  Omit<BankTransaction, "remainingRemoteContent">
>[] = [
  {
    accessorKey: "name",
    header: "Description",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return name || "No description";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return formatCurrency(amount);
    },
  },
];
