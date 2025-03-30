"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@fundlevel/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fundlevel/ui/components/select";
import { cn } from "@fundlevel/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

interface DataTablePaginationProps<TData>
  extends ComponentPropsWithoutRef<"div"> {
  table: Table<TData>;
  showPageCount?: boolean;
  showSelectedRowCount?: boolean;
  showPageSizeSelector?: boolean;
  paginationButtons?: "default" | "compact";
  // Props for infinite scroll
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export function DataTablePagination<TData>({
  table,
  className,
  showPageCount = true,
  showSelectedRowCount = true,
  showPageSizeSelector = true,
  paginationButtons = "default",
  // Destructure infinite scroll props
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  ...props
}: DataTablePaginationProps<TData>) {
  // Determine if standard pagination or infinite scroll is used
  const isInfinite = fetchNextPage !== undefined;

  const handleNextPageClick = () => {
    if (isInfinite && fetchNextPage) {
      fetchNextPage();
    } else {
      table.nextPage();
    }
  };

  const canGoNext = isInfinite ? hasNextPage : table.getCanNextPage();
  // Use isFetchingNextPage when in infinite mode
  const isFetching = isInfinite ? isFetchingNextPage : false; // Default to false if not infinite mode

  // For infinite scroll, previous/first/last page buttons are typically disabled
  const canGoPrevious = isInfinite ? false : table.getCanPreviousPage();

  return (
    <div
      className={cn(
        "flex items-center px-2",
        showSelectedRowCount ? "justify-between" : "justify-end",
        className,
      )}
      {...props}
    >
      {showSelectedRowCount && (
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      )}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {showPageSizeSelector && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              // Disable page size selector when fetching next page in infinite mode
              disabled={isInfinite && isFetching}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {showPageCount && !isInfinite && (
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        )}
        <div className="flex items-center space-x-2">
          {paginationButtons === "default" && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!canGoPrevious || isInfinite}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!canGoPrevious || isInfinite}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleNextPageClick}
            disabled={!canGoNext || isFetching}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {paginationButtons === "default" && (
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!canGoNext || isInfinite}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
