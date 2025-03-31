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
export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "remoteId",
    header: "Invoice ID",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("totalAmount") as number;
      const currency = row.original.currency || "USD";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(amount);
    },
  },
  {
    accessorKey: "balanceRemaining",
    header: "Balance",
    cell: ({ row }) => {
      const balance = (row.getValue("balanceRemaining") as number) || 0;
      const currency = row.original.currency || "USD";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(balance);
    },
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
