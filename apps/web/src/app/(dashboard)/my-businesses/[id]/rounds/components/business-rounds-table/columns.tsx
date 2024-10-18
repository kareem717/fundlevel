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
import { Round } from "@/lib/api"
import Link from "next/link"
import { format } from "date-fns"

export const columns = (businessId: number): ColumnDef<Round>[] => [
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
    accessorKey: "beginsAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Begins At" />
    ),
    cell: ({ row }) => {
      const beginsAt = row.getValue("beginsAt") as Date
      return <div className="text-left font-medium">{format(beginsAt, "PPP")}</div>
    },
  },
  {
    accessorKey: "buyIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy In" />
    ),
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
    accessorKey: "deletedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Deleted At" />
    ),
    cell: ({ row }) => {
      const deletedAt = row.getValue("deletedAt") as Date | null
      return <div className="text-left font-medium">{deletedAt ? format(deletedAt, "PPP") : "N/A"}</div>
    },
  },
  {
    accessorKey: "endsAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ends At" />
    ),
    cell: ({ row }) => {
      const endsAt = row.getValue("endsAt") as Date
      return <div className="text-left font-medium">{format(endsAt, "PPP")}</div>
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "investorCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investor Count" />
    ),
  },
  {
    accessorKey: "percentageOffered",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage Offered" />
    ),
    cell: ({ row }) => {
      const percentageOffered = row.getValue("percentageOffered") as number
      return <div className="text-left font-medium">{percentageOffered}%</div>
    },
  },
  {
    accessorKey: "percentageValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage Value" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "successful" | "failed"
      return <div className="text-left font-medium">{titleCase(status)}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as Date | null
      return <div className="text-left font-medium">{updatedAt ? format(updatedAt, "PPP") : "N/A"}</div>
    },
  },
  {
    accessorKey: "valueCurrency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value Currency" />
    ),
    cell: ({ row }) => {
      const valueCurrency = row.getValue("valueCurrency") as "usd" | "gbp" | "eur" | "cad" | "aud" | "jpy"
      return <div className="text-left font-medium">{valueCurrency.toUpperCase()}</div>
    },
  },
  {
    accessorKey: "ventureId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Venture ID" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const venture = row.original
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
              onClick={() => navigator.clipboard.writeText(venture.id.toString())}
            >
              Copy venture ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/my-businesses/${businessId}/ventures/${venture.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/my-businesses/${businessId}/ventures/${venture.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
