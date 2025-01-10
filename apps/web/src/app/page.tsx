import Link from "next/link";
import React from "react";
import redirects from "@/lib/config/redirects";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Link href={redirects.app.dashboard.index}>
        Dashboard
      </Link>
    </div>
  );
}