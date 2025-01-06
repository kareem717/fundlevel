import { ReactNode } from "react";
import { ExploreNav } from "./explore/components/layout/nav";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <ExploreNav />
      {children}
    </div>
  );
}
