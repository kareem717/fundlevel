import React from "react";
import { ExploreIndex } from "./components/explore-index";
import FilterBar from "./components/filter-bar";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col">
      <FilterBar />
      <div className="px-4 md:px-8 lg:px-20 w-full max-w-[3000px] mx-auto h-full">
        <ExploreIndex />
      </div>
    </div>
  );
}
