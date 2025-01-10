"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { Button } from "@repo/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"
import { Checkbox } from "@repo/ui/components/checkbox"
import { Icons } from "@/components/icons"
import { DataTableColumnHeader } from "@/components/data-table"
import { titleCase } from "title-case"
import { Investment } from "@repo/sdk"
import Link from "next/link"
import redirects from "@/lib/config/redirects"
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
} from "@repo/ui/components/table"
import { DataTablePagination } from "@/components/data-table"
import { ComponentPropsWithoutRef, FC, useEffect, useMemo, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { getAccountInvestmentsByPage } from "@/actions/investments"
import { Skeleton } from "@repo/ui/components/skeleton"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@repo/ui/lib/utils"

const ActionsCell: FC<{ row: Row<Investment> }> = ({ row }) => {
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
        <DropdownMenuItem asChild>
          {/*//TODO: handle better*/}
          <Link href={redirects.app.explore.round.view(investment?.roundId?.toString() ?? "")}>
            View round
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Investment>[] = [
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
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" isSortable={false} />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return <div className="text-left font-medium">{titleCase(status)}</div>
    },
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
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]

interface AccountInvestmentsTableProps extends ComponentPropsWithoutRef<"div"> {
  tableProps?: ComponentPropsWithoutRef<typeof Table>
}

export const AccountInvestmentsTable: FC<AccountInvestmentsTableProps> = ({ className, tableProps, ...props }) => {
  const [data, setData] = useState<Investment[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowCount, setRowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

  const { execute, isExecuting } = useAction(getAccountInvestmentsByPage, {
    onSuccess: ({ data }) => {
      setData(data?.investments || [])
      setRowCount(data?.total || 0)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  useEffect(() => {
    execute({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    })
  }, [pagination.pageIndex, pagination.pageSize, execute])

  const columnsMemo = useMemo(
    () =>
      isExecuting
        ? columns.map((column) => ({
          ...column,
          cell: () => <Skeleton className="h-8 w-full" />,
        }))
        : columns,
    [isExecuting]
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
    <div className={cn("flex flex-col gap-4 w-full h-full", className)} {...props}>
      <div className="rounded-md border h-full">
        <Table className={cn("h-full", tableProps?.className)} {...tableProps}>
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
          <TableBody className={cn("h-full")}>
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
