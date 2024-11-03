import { ReactNode } from "react";
import { ExploreNav } from "./components/layout/nav";
import { ExploreFooter } from "./components/layout/footer";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <ExploreNav />
      {children}
      {/* <ExploreFooter /> */}
    </div>
  );
}
