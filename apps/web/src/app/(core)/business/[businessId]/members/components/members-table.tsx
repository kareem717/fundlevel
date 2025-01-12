"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table"
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@repo/ui/components/dropdown-menu"
import { Button } from "@repo/ui/components/button"
import { Icons } from "@/components/icons"
import { BusinessMemberWithRoleNameAndAccount } from "@repo/sdk"
import { useAction } from "next-safe-action/hooks"
import { useBusiness } from "@/components/providers/business-provider"
import { createParser, parseAsInteger, useQueryState, useQueryStates } from "nuqs"
import { object } from "yup"
import { Skeleton } from "@repo/ui/components/skeleton"
import { getBusinessMembersByPage } from "@/actions/busineses"

export const columns: ColumnDef<BusinessMemberWithRoleNameAndAccount>[] = [
  {
    accessorKey: "account.firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { account } = row.original
      return <div className="text-left font-medium">{account.first_name} {account.last_name}</div>
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const { role } = row.original
      return <div className="text-left font-medium">{role}</div>
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
              onClick={() => navigator.clipboard.writeText(investor.account.first_name + " " + investor.account.last_name)}
            >
              Copy account name
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface MemberTableProps extends ComponentPropsWithoutRef<typeof Table> {
}

export const MemberTable: FC<MemberTableProps> = ({ className }) => {
  const [data, setData] = useState<BusinessMemberWithRoleNameAndAccount[]>([])

  const { selectedBusiness } = useBusiness();

  if (!selectedBusiness) {
    throw new Error("MemberTable must be used inside a BusinessContextProvider.")
  }


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

  const { execute, isExecuting } = useAction(getBusinessMembersByPage, {
    onSuccess: ({ data }) => {
      setData(data?.members || [])
      setRowCount(data?.total || 0)

      console.log('data', data)
    },
    onError: (error) => {
      throw error;
    }
  });

  useEffect(() => {
    execute({
      businessId: selectedBusiness.id,
      // convert into nuqs state
      pagination,
    })
  }, [pagination, selectedBusiness.id, execute])

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
          value={table.getColumn("account.firstName")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("account.firstName")?.setFilterValue(event.target.value)
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
