"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import { titleCase } from "title-case"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { ComponentPropsWithoutRef, FC, useEffect, useMemo, useState } from "react"
import { DataTablePagination } from "@/components/ui/data-table"
import { Round } from "@/lib/api"
import { cn } from "@/lib/utils"
import redirects from "@/lib/config/redirects"
import { useAction } from "next-safe-action/hooks"
import { getBusinessRoundsByPage } from "@/actions/busineses"
import { Skeleton } from "@/components/ui/skeleton"

export const columns: ColumnDef<Round>[] = [
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
      <DataTableColumnHeader column={column} title="ID" isSortable={false} />
    ),
  },
  {
    accessorKey: "investorCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investor Count" isSortable={false} />
    ),
  },
  {
    accessorKey: "percentageOffered",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage Offered" isSortable={false} />
    ),
    cell: ({ row }) => {
      const percentageOffered = row.getValue("percentageOffered") as number
      return <div className="text-left font-medium">{percentageOffered}%</div>
    },
  },
  {
    accessorKey: "percentageValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage Value" isSortable={false} />
    ),
    cell: ({ row }) => {
      const percentageValue = `${row.original.percentageValue} ${row.original.valueCurrency.toUpperCase()}`
      return <div className="text-left font-medium">{percentageValue}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" isSortable={false} />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as "active" | "successful" | "failed"
      return <div className="text-left font-medium">{titleCase(status)}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" isSortable={false} />
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as Date | null
      return <div className="text-left font-medium">{updatedAt ? format(updatedAt, "PPP") : "N/A"}</div>
    },
  },
  {
    accessorKey: "ventureId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Venture ID" isSortable={false} />
    ),
  },
  {
    id: "actions",
    header: ({ table }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter(
              (column) => column.getCanHide()
            )
            .map((column) => {
              if (column.id === "actions") {
                return null
              }
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
    ),
    cell: ({ row }) => {
      const round = row.original
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
              onClick={() => navigator.clipboard.writeText(round.id.toString())}
            >
              Copy round ID
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={redirects.app.explore.roundView.replace("[id]", round.id.toString())}>View public page</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export interface BusinessRoundsTableProps extends ComponentPropsWithoutRef<typeof Table> {
  businessId: number
}

export const BusinessRoundsTable: FC<BusinessRoundsTableProps> = ({
  businessId,
  ...props
}) => {
  const [data, setData] = useState<Round[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowCount, setRowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

  const { execute, isExecuting } = useAction(getBusinessRoundsByPage, {
    onSuccess: ({ data }) => {
      setData(data?.rounds || [])
      setRowCount(data?.total || 0)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  useEffect(() => {
    execute({
      businessId,
      pagination: {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      },
    })
  }, [pagination.pageIndex, pagination.pageSize, businessId])

  const columnsMemo = useMemo(
    () =>
      isExecuting
        ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton className="h-8 w-full" />,
        }))
        : columns,
    [isExecuting, columns]
  );

  const table = useReactTable({
    data,
    columns: columnsMemo,
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
    <div className={"flex flex-col gap-4 w-full h-full"} {...props}>
      <div className="rounded-md border">
        <Table {...props}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
