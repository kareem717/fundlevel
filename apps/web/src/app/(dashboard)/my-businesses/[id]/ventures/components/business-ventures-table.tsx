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
import { Input } from "@/components/ui/input"
import { ComponentPropsWithoutRef, FC, useEffect, useMemo, useState } from "react"
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table"
import { Venture } from "@/lib/api"
import { useAction } from "next-safe-action/hooks"
import { getBusinessVentures } from "@/actions/busineses"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { titleCase } from "title-case"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"
import redirects from "@/lib/config/redirects"
import { toast } from "sonner"
import { truncateText } from "@/lib/utils"

export const columns: ColumnDef<Venture>[] = [
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
      <DataTableColumnHeader column={column} title="Name" isSortable={false} />
    ),
    cell: ({ row }) => {
      const name = row.original.name
      return <div className="text-left font-medium">{titleCase(name)}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" isSortable={false} />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      return <div className="text-left font-medium">{format(createdAt, "PPP")}</div>
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" isSortable={false} />
    ),
    cell: ({ row }) => {
      const description = truncateText(row.original.description, 40)
      return <div className="text-left font-medium">{description}</div>
    },
  },
  {
    accessorKey: "isHidden",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Hidden" isSortable={false} />
    ),
    cell: ({ row }) => {
      const isHidden = row.original.isHidden
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="text-left font-medium truncate max-w-32" title={isHidden ? "Yes" : "No"}>
                {isHidden ? "Yes" : "No"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isHidden ? "This venture is hidden from the public." : "This venture is visible to the public."}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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
              <Link
                href={redirects.app.myBusinesses.view.ventures.view.root.replace(":id", venture.businessId.toString()).replace(":ventureId", venture.id.toString())}
              >
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={redirects.app.myBusinesses.view.ventures.view.edit.replace(":id", venture.businessId.toString()).replace(":ventureId", venture.id.toString())}
              >
                Edit
              </Link>
            </DropdownMenuItem>
            {venture.isHidden ? (
              <DropdownMenuItem onClick={() => {
                //TODO: Implement show venture
                toast.info("This feature is not implemented yet")
              }}>
                Show
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => {
                //TODO: Implement hide venture
                toast.info("This feature is not implemented yet")
              }}>
                Hide
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Rounds</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`${redirects.app.myBusinesses.view.rounds.create.replace(":id", venture.businessId.toString())}?ventureId=${venture.id}`}
                className="flex items-center gap-2"
              >
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${redirects.app.myBusinesses.view.rounds.view.replace(":id", venture.businessId.toString())}?ventureId=${venture.id}`}>Create</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export interface DataTableProps extends ComponentPropsWithoutRef<typeof Table> {
  businessId: number
}

export const BusinessVenturesTable: FC<DataTableProps> = ({
  businessId,
  ...props
}) => {
  const [data, setData] = useState<Venture[]>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [rowCount, setRowCount] = useState(0)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = useState({})

  const { execute, isExecuting } = useAction(getBusinessVentures, {
    onSuccess: ({ data }) => {
      setData(data?.ventures || [])
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
    <div className="flex flex-col gap-4 w-full h-full">
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
        </Table >
      </div >
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div >
  )
}
