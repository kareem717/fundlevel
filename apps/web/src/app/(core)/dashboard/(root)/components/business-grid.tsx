"use client"

import { useBusiness } from "../../../../../components/providers/business-provider";
import { redirects } from "@/lib/config/redirects";
import Link from "next/link";


export function BusinessGrid() {
  const { businesses } = useBusiness();

  return (
    <div>
      {businesses.map((business) => {

        const businessDashboardUrl = redirects.app.businessDashboard(business.id).root

        console.log(businessDashboardUrl)
        return (
          <Link
            key={business.id} href={businessDashboardUrl}
            // TODO: Prefetch might be a bit too much
            prefetch={true}
            className="p-4 bg-foreground/10 rounded-md"
          >
            {business.display_name}
          </Link>
        )
      })}
    </div>
  )
}