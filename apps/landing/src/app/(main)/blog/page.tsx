import BlogFilters from "./components/filter";
import { FilteredPagination } from "./components/pagination";
import getPayload from "@/lib/utils/getPayload";
import { blogFiltersCache } from "./components/searchParams";
import { BlogCategory } from "@/payload-types";
import { Metadata } from "next";

export const revalidate = 600;

type Args = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page({ searchParams }: Args) {
  const searchParams_ = await searchParams;
  const { category, page } = blogFiltersCache.parse(searchParams_);
  const payload = await getPayload();

  const categories = await payload.find({
    collection: "blog-categories",
    depth: 0,
    where: {
      showInFilter: {
        equals: true,
      },
    },
  });

  const categoryId = categories.docs?.find(
    (result: BlogCategory) => result.slug === category
  )?.id;

  return (
    <div className="flex flex-col min-h-screen space-y-16">
      <BlogFilters categories={categories.docs} />
      <FilteredPagination
        category={categoryId?.toString() ?? ""}
        page={page ?? ""}
      />
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog`,
  };
}
