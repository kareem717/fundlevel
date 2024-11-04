import React from "react";
import FilterBar from "./components/filter-bar";
import { VentureList } from "./components/venture-list";
import { getVenturesInfinite } from "@/actions/ventures";
import { Suspense } from "@/components/ui/suspense";

export default async function ExplorePage() {
  const ventures = await getVenturesInfinite({
    cursor: 1,
    limit: 10,
  });

  return (
    <div className="flex flex-col space-y-6">
      <FilterBar />
      <div className="flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <VentureList
            title="Featured Ventures"
            ventures={ventures?.data?.ventures || []}
          />
          <VentureList
            title="Latest Ventures"
            ventures={ventures?.data?.ventures || []}
          />
        </Suspense>
      </div>
    </div>
  );
}
