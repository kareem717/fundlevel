"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { BankTransaction } from "@fundlevel/db/types";

// Helper function to format currency
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};


export const transactionColumns: ColumnDef<Omit<BankTransaction, "remainingRemoteContent">>[] = [
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