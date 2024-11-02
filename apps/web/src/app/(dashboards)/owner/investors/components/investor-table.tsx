"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import { format } from "date-fns"
import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/ui/data-table"
import { ComponentPropsWithoutRef, FC, useState } from "react"
import { faker } from "@faker-js/faker"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import redirects from "@/lib/config/redirects"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Investor = {
  name: string
  buyIn: number
  stake: number
  expiry: Date | null
}

// use faker.js to generate 15 investors
const investors: Investor[] = Array.from({ length: 15 }, () => ({
  name: faker.person.fullName(),
  buyIn: faker.number.int({ min: 1000, max: 1000000 }),
  stake: faker.number.float({ min: 1, max: 95 }),
  expiry: faker.date.future(),
}))

export const columns: ColumnDef<Investor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return <div className="text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: "buyIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy In" />
    ),
    cell: ({ row }) => {
      const { buyIn } = row.original
      return <div className="text-left font-medium">{Math.round(buyIn)}</div>
    },
  },
  {
    accessorKey: "stake",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage" />
    ),
    cell: ({ row }) => {
      const { stake } = row.original
      return <div className="text-left font-medium">{Number.isInteger(stake) ? stake : stake.toFixed(2)}%</div>
    },
  },
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract Expiry" />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original
      return <div className="text-left font-medium">{expiry ? format(expiry, "PPP") : "Never"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const investor = row.original
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
              onClick={() => navigator.clipboard.writeText(investor.name)}
            >
              Copy investor name
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface InvestorTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const InvestorTable: FC<InvestorTableProps> = ({ className }) => {
  const data = investors
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})


  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      setPagination(updater)
    },
    rowCount,
    manualPagination: true,
    state: {
      pagination,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div />
      </div>
      <div className="rounded-md border">
        <Table className={className}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
