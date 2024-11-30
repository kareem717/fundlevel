import { ComponentPropsWithoutRef, FC } from "react";
import configPromise from "@payload-config";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import { Pagination } from "./pagination";
import { PostArchive } from "../post-archive";
import { PageRange } from "./page-range";

export interface FilteredPaginationProps
  extends ComponentPropsWithoutRef<"div"> {
  category?: string;
  page?: number;
}

export const FilteredPagination: FC<FilteredPaginationProps> = async ({
  category,
  page,
  ...props
}) => {
  const payload = await getPayloadHMR({ config: configPromise });

  const posts = await payload.find({
    collection: "posts",
    depth: 1,
    limit: 9,
    ...(category && {
      where: {
        categories: {
          in: [category],
        },
      },
    }),
    ...(page && {
      page,
    }),
  });

  return (
    <div className="flex flex-col container" {...props}>
      <PageRange
        collection="posts"
        currentPage={posts.page}
        limit={9}
        totalDocs={posts.totalDocs}
        className="mb-6"
      />

      <PostArchive posts={posts.docs} />

      {posts.totalPages > 1 && <Pagination totalPages={posts.totalPages} />}
    </div>
  );
};
