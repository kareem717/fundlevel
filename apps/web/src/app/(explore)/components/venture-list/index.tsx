import React from "react";
import { Venture } from "@/lib/api";
import VentureListClient from "./client";
import { getVenturesInfinite } from "@/actions/ventures";

type VentureListProps = {
  title: string;
};

export async function VentureList({ title }: VentureListProps) {
  const ventures = await getVenturesInfinite({
    cursor: 1,
    limit: 10,
  })
    .then((res) => {
      return res?.data?.ventures || [];
    })
    .catch((err) => {
      console.error(err);
      return [] as Venture[];
    });

  return (
    <div className="w-full py-6">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-6 md:mb-8 text-center md:text-left">
          {title}
        </h2>
        <div className="relative max-w-[400px] md:max-w-none mx-auto">
          <VentureListClient ventures={ventures} />
        </div>
      </div>
    </div>
  );
}
