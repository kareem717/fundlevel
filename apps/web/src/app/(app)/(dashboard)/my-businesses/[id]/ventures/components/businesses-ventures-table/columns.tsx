"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/ui/icons"
import { DataTableColumnHeader } from "@/components/ui/data-table"
import { titleCase } from "title-case"
import { Venture } from "@/lib/api"
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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.original.name
      return <div className="text-left font-medium">{titleCase(name)}</div>
    },
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description
      return <div className="text-left font-medium">{description}</div>
    },
  },
  {
    accessorKey: "isHidden",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Hidden" />
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
