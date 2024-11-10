"use client";

import React, { useState } from "react";
import { Industry, Venture } from "@/lib/dev/types";
import { parseAsArrayOf, useQueryState } from "nuqs";
import { VentureCard } from "../venture-card";

import { ventures } from "@/lib/dev/config";

export function VentureList() {
  const [list, _] = useQueryState("list", {
    defaultValue: "featured",
    clearOnDefault: false,
  });

  const [filterIndustries, setFilterIndustries] = useQueryState(
    "industries",
    parseAsArrayOf<string>({
      parse: (value) => value,
      serialize: (value) => value,
    })
  );

  const venturesFiltered = ventures.filter(
    (venture) =>
      venture.category === list.charAt(0).toUpperCase() + list.slice(1) &&
      (filterIndustries?.length ?? 0 > 0
        ? filterIndustries?.every((industry) =>
            venture.industries.includes(
              industry.charAt(0).toUpperCase() as Industry
            )
          )
        : true)
  );

  return (
    <div className="container pt-6">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6 md:mb-8 ">
          {list.charAt(0).toUpperCase() + list.slice(1)}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venturesFiltered.map((venture) => (
          <VentureCard key={venture.title} venture={venture} />
        ))}
      </div>
    </div>
  );
}
