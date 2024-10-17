"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import { titleCase } from "title-case"
import { Address, Business, Round, RoundInvestment, Venture } from "@/lib/api"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"
import { toast } from "sonner"

export const columns = (businessId: number): ColumnDef<RoundInvestment>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return <div className="text-left font-medium">{titleCase(name)}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date
      return <div className="text-left font-medium">{format(createdAt, "PPP")}</div>
    },
  },
  {
    accessorKey: "businessNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Number" />
    ),
    cell: ({ row }) => {
      const businessNumber = row.getValue("businessNumber") as string
      return <div className="text-left font-medium">{businessNumber}</div>
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const address = row.getValue("address") as Address
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-left font-medium truncate max-w-32" title={address?.fullAddress || "N/A"}>
                {address?.fullAddress || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{address?.fullAddress || "N/A"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const investment = row.original
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
            <DropdownMenuItem
              onClick={() => {
                toast.info("Not implemented")
              }}
            >
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.info("Not implemented")
              }}
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
