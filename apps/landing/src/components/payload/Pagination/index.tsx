'use client'

import React from 'react'
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/components/pagination'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            {hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious
                  size="sm"
                  onClick={() => {
                    router.push(`/posts/page/${page - 1}`)
                  }}
                />
              </PaginationItem>
            )}

            {!hasPrevPage && (
              <PaginationItem>
                <PaginationPrevious
                  size="sm"
                  isActive={false}
                />
              </PaginationItem>
            )}
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                size="sm"
                onClick={() => {
                  router.push(`/posts/page/${page - 1}`)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              size="sm"
              isActive
              onClick={() => {
                router.push(`/posts/page/${page}`)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                size="sm"
                onClick={() => {
                  router.push(`/posts/page/${page + 1}`)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            {hasNextPage && (
              <PaginationItem>
                <PaginationNext
                  size="sm"
                  onClick={() => {
                    router.push(`/posts/page/${page + 1}`)
                  }}
                />
              </PaginationItem>
            )}

            {!hasNextPage && (
              <PaginationItem>
                <PaginationNext
                  size="sm"
                  isActive={false}
                />
              </PaginationItem>
            )}
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
