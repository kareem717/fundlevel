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
import { Icons } from "@/components/icons"
import { RoundInvestment } from "@/lib/api"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "next-safe-action/hooks"
import { useBusinessContext } from "../../../components/business-context"
import { createParser, parseAsInteger, useQueryState, useQueryStates } from "nuqs"
import { getBusinessInvestmentsByPage } from "@/actions/busineses"
import { Badge } from "@/components/ui/badge"
import { titleCase } from "title-case"
import { object } from "yup"
import { formatCurrency } from "@/lib/utils"

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
    id: "valuation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valuation" />
    ),
    cell: ({ row }) => {
      return (
        //TODO: handle better
        <>
          {row.original.round?.percentageOffered && row.original.round?.percentageValue ? (
            <div className="text-left font-medium">
              {formatCurrency(
                row.original.round?.percentageOffered / row.original.round?.percentageValue,
                row.original.round?.valueCurrency,
              )}
            </div>
          ) : (
            <div className="text-left font-medium">
              N/A
            </div>
          )}
        </>
      )
    },
  },
  {
    accessorKey: "investor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Investor" />
    ),
    cell: ({ row }) => {
      //TODO: handle better
      if (!row.original.investor) {
        return <div className="text-left font-medium">N/A</div>
      }
      const { firstName, lastName } = row.original.investor
      return (
        <div className="text-left font-medium">
          {firstName} {lastName}
        </div>
      )
    },
  },
  {
    accessorKey: "round.buyIn",
    id: "buy in",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Buy In" />
    ),
    cell: ({ row }) => {
      const round = row.original.round
      return (
        <div className="text-left font-medium">
          {/*//TODO: handle better*/}
          {round?.buyIn ? (
            <>{formatCurrency(round.buyIn, round.valueCurrency)}</>
          ) : (
            <div className="text-left font-medium">
              N/A
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      switch (status) {
        case "successful":
          return <Badge variant="default">{titleCase(status)}</Badge>
        case "pending":
          return <Badge variant="outline">{titleCase(status)}</Badge>
        case "processing":
          return <Badge variant="secondary">{titleCase(status)}</Badge>
        default:
          return <Badge variant="destructive">{titleCase(status)}</Badge>
      }
    },
  },
  {
    accessorKey: "createdAt",
    id: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export interface RecievedInvestmentsTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const RecievedInvestmentsTable: FC<RecievedInvestmentsTableProps> = ({
  className
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

  const parser = useMemo(() => createParser(
    {
      parse: (value: unknown) => object().test(
        'is-visibility-state',
        'Must be a valid visibility state object',
        (value) => {
          if (typeof value !== 'object' || value === null) return false;
          return Object.entries(value).every(([_, v]) => typeof v === 'boolean');
        }
      ).validateSync(value) as VisibilityState,
      serialize: (value: VisibilityState) => {
        return Object.entries(value).map(([key, value]) => `${key}=${value ? 'true' : 'false'}`).join(',')
      },
    }),
    []
  )

  const [columnVisibility, setColumnVisibility] = useQueryState('columns', parser.withDefault({}))

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

  useEffect(() => {
    execute({
      businessId: currentBusiness.id,
      pagination
    })
  }, [pagination, currentBusiness.id, execute])

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
                <TableCell colSpan={columnsMemo.length} className="h-24 text-center">
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
