import { getBusinessesAction } from "@/actions/busineses";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";

export const dynamic = "force-dynamic";

export default async function RootDashboardPage() {
  const response = await getBusinessesAction()

  const businesses = response?.data?.businesses || []

  return (
    <div className="flex flex-wrap gap-4">
      {businesses.length > 0 ? businesses.map((business) => (
        <Link
          key={business.id}
          href={redirects.app.businessDashboard(business.id).root} className="bg-secondary rounded-md aspect-square w-32 flex items-center justify-center"
        >
          {business.displayName}
        </Link>
      )) : <div className="flex-1">No businesses found</div>}
    </div>
  )
}

