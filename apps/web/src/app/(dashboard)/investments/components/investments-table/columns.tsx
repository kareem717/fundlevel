"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import { titleCase } from "title-case"
import { RoundInvestment } from "@/lib/api"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { WithdrawInvestmentButton } from "../withdraw-investment-button"
import { useState } from "react"
import Link from "next/link"
import redirects from "@/lib/config/redirects"

export const columns: ColumnDef<RoundInvestment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid At" />
    ),
    cell: ({ row }) => {
      const paidAt = row.getValue("paidAt") as Date
      return <div className="text-left font-medium">{paidAt ? format(paidAt, "PPP") : "Not paid"}</div>
    },
  },
  {
    id: "buyIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy In" />
    ),
    cell: ({ row }) => {
      const round = row.original.round
      return <div className="text-left font-medium">{round.buyIn}</div>
    },
  },
  {
    id: "percentageValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage" />
    ),
    cell: ({ row }) => {
      const round = row.original.round
      return <div className="text-left font-medium">{round.percentageValue}</div>
    },
  },
  {
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return <div className="text-left font-medium">{titleCase(status)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const investment = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(investment.id.toString())}
            >
              Copy investment ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={redirects.app.explore.roundView.replace(":roundId", investment.round.id.toString())}>
                View round
              </Link>
            </DropdownMenuItem>
            {investment.status === "pending" && (
              <>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  Withdraw
                </DropdownMenuItem>
                <AlertDialog open={isDialogOpen}>
                  <AlertDialogTrigger className="rounded-sm px-2 py-1.5 text-sm hover:bg-muted w-full">
                    <span className="flex items-center justify-start w-full">
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Withdraw investment</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your investment application will be cancelled,
                        and you will have to reapply if you want to invest in the same round.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <WithdrawInvestmentButton investmentId={investment.id} onSuccess={() => setIsDialogOpen(false)} />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            {investment.status === "accepted" && !investment.paidAt && (
              <DropdownMenuItem asChild>
                <Link href={redirects.app.investments.checkout.replace(":investmentId", investment.id.toString())}>
                  Checkout
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
