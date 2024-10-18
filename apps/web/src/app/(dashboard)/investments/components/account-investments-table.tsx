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
import { WithdrawInvestmentButton } from "./withdraw-investment-button"
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
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/ui/data-table"
import { ComponentPropsWithoutRef, FC, useEffect, useMemo, useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { getAccountInvestmentsByPage } from "@/actions/investments"
import { Skeleton } from "@/components/ui/skeleton"

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
      <DataTableColumnHeader column={column} title="Buy In" isSortable={false} />
    ),
    cell: ({ row }) => {
      const round = row.original.round
      return <div className="text-left font-medium">{round.buyIn}</div>
    },
  },
  {
    id: "percentageValue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage" isSortable={false} />
    ),
    cell: ({ row }) => {
      const round = row.original.round
      return <div className="text-left font-medium">{round.percentageValue}</div>
    },
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
    cell: ({ row }) => {
      const investment = row.original
      const [isDialogOpen, setIsDialogOpen] = useState(false)
      const [isDropdownOpen, setIsDropdownOpen] = useState(false)

      return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={() => { }}>
          <DropdownMenuTrigger onClick={() => setIsDropdownOpen(true)}>
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
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)} >
                  Withdraw
                </DropdownMenuItem>
                <AlertDialog open={isDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Withdraw investment</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your investment application will be cancelled,
                        and you will have to reapply if you want to invest in the same round.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className="w-full"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsDropdownOpen(false)
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <WithdrawInvestmentButton
                        investmentId={investment.id}
                        onSuccess={() => {
                          setIsDialogOpen(false)
                          setIsDropdownOpen(false)
                        }}
                        className="w-full"
                      />
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

interface AccountInvestmentsTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const AccountInvestmentsTable: FC<AccountInvestmentsTableProps> = () => {
  const [data, setData] = useState<RoundInvestment[]>([])
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
  }, [pagination.pageIndex, pagination.pageSize])

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
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="rounded-md border">
        <Table>
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
