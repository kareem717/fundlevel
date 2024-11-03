import React from "react";
import { ExploreIndex } from "./components/explore-index";
import FilterBar from "./components/filter-bar";
import { VentureList } from "./components/venture-list";
import { getVentureLikeCount } from "@/lib/api";

export default async function ExplorePage() {
  
  return (
    <div className="flex flex-col space-y-6">
      <FilterBar />
      <div className="flex flex-col">
        <VentureList title="Featured Ventures" ventures={[]} />
        <VentureList title="Latest Ventures" ventures={[]} />
      </div>
    </div>
  );
}
