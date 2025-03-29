export type CursorPaginationParams<C = string | number> = {
  cursor: C | null;
  limit: number;
  order: "asc" | "desc";
};

export type CursorPaginationResult<D, C = string | number> = {
  data: D[];
  nextCursor: C | null;
};

export type OffsetPaginationParams = {
  offset: number;
  limit: number;
  order: "asc" | "desc";
};

export type OffsetPaginationResult<D> = {
  data: D[];
  currentPage: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
