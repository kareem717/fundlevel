"use client"

import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ComponentPropsWithoutRef, FC, useEffect, useMemo, useState } from "react"
import { DataTablePagination, DataTableColumnHeader } from "@/components/data-table"
import { Icons } from "@/components/ui/icons"
import { RoundInvestment } from "@/lib/api"
import { format } from "date-fns"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "next-safe-action/hooks"
import { useBusinessContext } from "../../../components/business-context"
import { parseAsInteger, useQueryStates } from "nuqs"
import { getBusinessInvestmentsByPage } from "@/actions/busineses"
import { processInvestment } from "@/actions/investments"

export const columns = (
  processInvestment: (id: number) => void,
  isProcessingInvestment: boolean
): ColumnDef<RoundInvestment>[] => [
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return <div className="text-left font-medium">{format(createdAt, "PPP")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const investment = row.original
      console.log('investment', investment)
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
                if (isProcessingInvestment) {
                  toast.info("Investment is already being processed, please wait for it to finish.")
                  return
                }
                processInvestment(investment.id)
              }}
              disabled={isProcessingInvestment}
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

export interface RecievedInvestmentsTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const RecievedInvestmentsTable: FC<RecievedInvestmentsTableProps> = ({
}) => {

  const { currentBusiness } = useBusinessContext()

  if (!currentBusiness) {
    throw new Error("RecievedInvestmentsTable must be used inside a BusinessContextProvider.")
  }

  const [data, setData] = useState<RoundInvestment[]>([])

  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10)
    },
    {
      urlKeys: {
        pageSize: 'limit'
      }
    }
  )

  const [rowCount, setRowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

  const { execute, isExecuting } = useAction(getBusinessInvestmentsByPage, {
    onSuccess: ({ data }) => {
      console.log('data', data)
      setData(data?.investments || [])
      setRowCount(data?.total || 0)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  const { execute: process, isExecuting: isProcessingInvestment } = useAction(processInvestment, {
    onSuccess: () => {
      toast.success("Investment processed")
    },
    onError: (error) => {
      toast.error("Failed to process investment")
      console.error(error)
    },
  })

  useEffect(() => {
    execute({
      businessId: currentBusiness.id,
      pagination
    })
  }, [pagination, currentBusiness.id, execute])

  const columnsMemo = useMemo(
    () =>
      isExecuting
        ? columns(process, isProcessingInvestment).map((column) => ({
          ...column,
          cell: () => <Skeleton className="h-8 w-full" />,
        }))
        : columns(process, isProcessingInvestment),
    [isExecuting]
  );

  const table = useReactTable<RoundInvestment>({
    data,
    columns: columnsMemo,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex: pagination.page - 1, pageSize: pagination.pageSize })
        setPagination({ page: newState.pageIndex + 1, pageSize: newState.pageSize })
      }
    },
    rowCount,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
      columnVisibility,
      rowSelection,
    },
    meta: {
      processInvestment: process,
      isProcessingInvestment,
    },
  })

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center py-4">
        {/* <Input
          placeholder="Filter name..."
          value={table.getColumn("name")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
