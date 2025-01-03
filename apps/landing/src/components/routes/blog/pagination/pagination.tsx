"use client";

import { ComponentPropsWithoutRef, FC } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination";
import { blogFiltersParsers } from "../searchParams";
import { useQueryStates } from "nuqs";

export interface PaginationProps extends ComponentPropsWithoutRef<"div"> {
  totalPages: number;
}

export const Pagination: FC<PaginationProps> = ({
  className,
  totalPages,
  ...props
}) => {
  const [{ page: currentPage }, setCurrentPage] =
    useQueryStates(blogFiltersParsers);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const hasExtraPrevPages = currentPage - 1 > 1;
  const hasExtraNextPages = currentPage + 1 < totalPages;

  return (
    <div className={cn("my-12", className)} {...props}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={hasPrevPage}
              onClick={() => {
                setCurrentPage({ page: currentPage - 1 });
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  setCurrentPage({ page: currentPage - 1 });
                }}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                setCurrentPage({ page: currentPage });
              }}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  setCurrentPage({ page: currentPage + 1 });
                }}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              isActive={hasNextPage}
              onClick={() => {
                setCurrentPage({ page: currentPage + 1 });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
