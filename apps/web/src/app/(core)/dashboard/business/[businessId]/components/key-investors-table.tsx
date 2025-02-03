"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
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
} from "@repo/ui/components/table"
import { DataTablePagination } from "@/components/data-table"
import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { faker } from "@faker-js/faker"

type Investor = {
  name: string
  buyIn: number
  stake: number
  expiry: Date | null
}


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
      <DataTableColumnHeader column={column} title="Buy In" isSortable={false} />
    ),
    cell: ({ row }) => {
      const { buyIn } = row.original
      return <div className="text-left font-medium">{Math.round(buyIn)}</div>
    },
  },
  {
    accessorKey: "stake",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Percentage" isSortable={false} />
    ),
    cell: ({ row }) => {
      const { stake } = row.original
      return <div className="text-left font-medium">{Number.isInteger(stake) ? stake : stake.toFixed(2)}%</div>
    },
  },
  {
    accessorKey: "expiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract Expiry" isSortable={false} />
    ),
    cell: ({ row }) => {
      const { expiry } = row.original
      return <div className="text-left font-medium">{expiry ? format(expiry, "PPP") : "Never"}</div>
    },
  },
]

interface KeyInvestorTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const KeyInvestorsTable: FC<KeyInvestorTableProps> = () => {
  const [data, setData] = useState<Investor[]>([])
  useEffect(() => {
    setData(Array.from({ length: 15 }, () => ({
      name: faker.person.fullName(),
      buyIn: faker.number.int({ min: 1000, max: 1000000 }),
      stake: faker.number.float({ min: 1, max: 95 }),
      expiry: faker.date.future(),
    })))
  }, [])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

  // const { execute, isExecuting } = useAction(getAccountInvestmentsByPage, {
  //   onSuccess: ({ data }) => {
  //     setData(data?.investments || [])
  //     setRowCount(data?.total || 0)
  //   },
  //   onError: (error) => {
  //     console.error(error)
  //   },
  // })

  // useEffect(() => {
  //   execute({
  //     page: pagination.pageIndex + 1,
  //     pageSize: pagination.pageSize,
  //   })
  // }, [pagination.pageIndex, pagination.pageSize, execute])

  // const columnsMemo = useMemo(
  //   () =>
  //     isExecuting
  //       ? columns.map((column) => ({
  //         ...column,
  //         cell: () => <Skeleton className="h-8 w-full" />,
  //       }))
  //       : columns,
  //   [isExecuting]
  // );

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
