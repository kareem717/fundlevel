import { BlogFilters } from "@/components/routes/blog/filter";
import { FilteredPagination } from "@/components/routes/blog/pagination";
import getPayload from "@/lib/utils/getPayload";
import { blogFiltersCache } from "@/components/routes/blog/searchParams";
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
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-24 bg-muted/40 mt-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Our Blog
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Insights, updates and stories from our team. Learn more about
              fundraising, investing and building great companies.
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 space-y-16 py-16">
        <BlogFilters categories={categories.docs} />
        <FilteredPagination
          category={categoryId?.toString() ?? ""}
          page={page ?? ""}
        />
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog`,
  };
}
