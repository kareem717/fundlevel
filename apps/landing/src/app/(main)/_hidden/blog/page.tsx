import { BlogFilters } from '@/components/routes/blog/filter'
import { FilteredPagination } from '@/components/routes/blog/pagination'
import getPayload from '@/lib/utils/getPayload'
import { blogFiltersCache } from '@/components/routes/blog/searchParams'
import { BlogCategory } from '@/payload-types'
import { Metadata } from 'next'
import Balancer from 'react-wrap-balancer'

export const revalidate = 600

type Args = {
  searchParams: Promise<{
    [key: string]: string | undefined
  }>
}

export default async function Page({ searchParams }: Args) {
  const searchParams_ = await searchParams
  const { category, page } = blogFiltersCache.parse(searchParams_)
  const payload = await getPayload()

  const categories = await payload.find({
    collection: 'blog-categories',
    depth: 0,
    where: {
      showInFilter: {
        equals: true,
      },
    },
  })

  const categoryId = categories.docs?.find(
    (result: BlogCategory) => result.slug === category
  )?.id

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative w-full py-24 mt-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground">
              Latest Updates & Insights
            </h1>
            <p className="max-w-[600px] text-muted-foreground text-base md:text-lg">
              <Balancer>
                Stay informed with expert insights on private market investing,
                tokenization, and financial innovation. Discover strategies,
                trends and success stories.
              </Balancer>
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6 justify-start">
            <h2 className="text-xl font-medium text-foreground">
              Browse by Category
            </h2>
            <BlogFilters categories={categories.docs} />
          </div>

          <div className="min-h-[200px]">
            <FilteredPagination
              category={categoryId?.toString() ?? ''}
              page={page ?? ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Blog`,
  }
}
