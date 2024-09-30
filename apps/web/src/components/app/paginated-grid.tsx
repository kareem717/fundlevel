"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export interface PaginatedGridProps<T> extends ComponentPropsWithoutRef<"div"> {
  initialData: T[]
  onNextPage: () => void
  onPreviousPage: () => void
  hasMore: boolean
  isFirstPage: boolean
};

export function PaginatedGrid<T>({
  initialData,
  onNextPage,
  onPreviousPage,
  hasMore,
  isFirstPage,
}: PaginatedGridProps<T>) {
  return (
    <div >
      <div>

      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={onPreviousPage} />
          </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={onNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
};