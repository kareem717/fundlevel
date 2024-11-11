import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";
// Note: import from 'nuqs/server' to avoid the "use client" directive

export const exploreSearchParamsCache = createSearchParamsCache({
  // List your search param keys and associated parsers here:
  list: parseAsString.withDefault("featured"),
  industry: parseAsString,
  min: parseAsInteger,
  max: parseAsInteger,
});
