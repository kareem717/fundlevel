"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@fundlevel/ui/components/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@fundlevel/ui/components/dropdown-menu";
import type { Invoice } from "@fundlevel/db/types";
import Link from "next/link";
import { redirects } from "@fundlevel/web/lib/config/redirects";
import { formatCurrency } from "@fundlevel/web/lib/utils";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "remoteId",
    header: "Invoice ID",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) =>
      formatCurrency(
        row.original.totalAmount,
        row.original.currency || undefined,
      ),
  },
  {
    accessorKey: "balanceRemaining",
    header: "Balance",
    cell: ({ row }) =>
      formatCurrency(
        row.original.balanceRemaining || 0,
        row.original.currency || undefined,
      ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return date ? new Date(date).toLocaleDateString() : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={redirects.app
                  .company(invoice.companyId)
                  .invoices.show(invoice.id)}
                prefetch={true}
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={redirects.app
                  .company(invoice.companyId)
                  .invoices.reconcile(invoice.id)}
                prefetch={true}
              >
                Reconcile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Download invoice", invoice.id);
              }}
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log("Mark as paid", invoice.id);
              }}
            >
              Mark as Paid
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
