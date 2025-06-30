export type CursorPaginationParams = {
  cursor: number | undefined;
  limit: number;
  order: "asc" | "desc";
};

export type CursorPaginationResult<D> = {
  data: D[];
  nextCursor: number | null;
};

export type OffsetPaginationParams = {
  page: number;
  pageSize: number;
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
