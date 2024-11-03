import React from "react";
import { ExploreIndex } from "./components/explore-index";
import FilterBar from "./components/filter-bar";
import { VentureList } from "./components/venture-list";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col">
      <FilterBar />
      <VentureList />
      <VentureList />
    </div>
  );
}
