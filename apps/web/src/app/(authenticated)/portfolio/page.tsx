import { buttonVariants } from "@/components/ui/button";
import redirects from "@/lib/config/redirects";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Your portfolio",
};

export default async function PortfolioPage() {
  //TODO: Implement
  return (
    <div>
      <h1>Portfolio</h1>
      <Link href={redirects.app.portfolio.investments.root} className={buttonVariants()}>
        My Investments
      </Link>
    </div>
  );
}
