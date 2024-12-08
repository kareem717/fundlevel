import React from "react";
import FilterBar from "./components/filter-bar";
// import { VentureList } from "./components/venture-list";
import { Suspense } from "@/components/suspense";
import Link from "next/link";

export default async function ExplorePage() {
  return (
    <div className="flex flex-col space-y-6 py-6">
      <Hero />
      <FilterBar />
      {/* <VentureList /> */}
    </div>
  );
}

function Hero() {
  return (
    <div className="container pt-6">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          Explore Investment Opportunities
        </h1>
        <p className="text-base text-neutral-500">
          Discover curated ventures seeking ethical, interest-free investments.{" "}
          <Link
            href="/vetting-process"
            className="text-primary hover:underline font-medium"
          >
            All businesses are thoroughly vetted
          </Link>{" "}
          through our due diligence process.
        </p>
      </div>
    </div>
  );
}
