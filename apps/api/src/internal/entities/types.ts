export type CursorPaginationParams<C = string | number> = {
  cursor: C | null;
  limit: number;
  order: "asc" | "desc";
};

export type CursorPaginationResult<D, C = string | number> = {
  data: D[];
  nextCursor: C | null;
};


