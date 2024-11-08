import React from "react";
import FilterBar from "./components/filter-bar";
import { VentureList } from "./components/venture-list";
import { Suspense } from "@/components/ui/suspense";
import { getVenturesInfinite } from "@/actions/ventures";

export default async function ExplorePage() {
  const ventures = await getVenturesInfinite({
    cursor: 1,
    limit: 10,
  });

  return (
    <div className="flex flex-col space-y-6 py-6">
      <FilterBar />
      <div className="flex flex-col">
        <Suspense fallback={<div>Loading...</div>}>
          <VentureList title="Featured Ventures" />
          <VentureList title="Latest Ventures" />
        </Suspense>
      </div>
    </div>
  );
}


