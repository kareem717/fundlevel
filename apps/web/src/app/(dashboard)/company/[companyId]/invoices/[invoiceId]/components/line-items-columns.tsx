"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { InvoiceLine } from "@fundlevel/db/types";
import { formatCurrency } from "@fundlevel/web/lib/utils";


export const lineItemsColumns: ColumnDef<InvoiceLine>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description || "No description";
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      return row.original.details?.[0]?.Qty || 1;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return formatCurrency(row.original.amount);
    },
  },
]; 