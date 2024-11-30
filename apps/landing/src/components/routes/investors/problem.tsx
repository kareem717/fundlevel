import { FC } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProblemStatementProps {
  className?: string;
}

const ProblemStatement: FC<ProblemStatementProps> = ({ className }) => {
  return (
    <section className={cn("container py-16 space-y-8 bg-muted/50", className)}>
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">
          Private markets have outstanding potential but are inaccessible or
          non-compliant.
        </h2>
        <p className="text-lg text-muted-foreground">
          There is over <span className="font-bold">$13 trillion</span> under
          management in private market investments, though very few are able to
          find opportunities for themselves - let alone while being shariah
          compliant.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">$10M</h3>
          <p className="text-muted-foreground">
            Many commercial private equity funds require immense capital
            investments to even work with them - barring most from reaping the
            gains in the growing market.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">34.5M</h3>
          <p className="text-muted-foreground">
            Out of the entire 34.5 million businesses, over 90% are considered
            small to medium. These businesses are not easily able to raise funds
            outside of debt financing - even when they are insanely profitable.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">44%</h3>
          <p className="text-muted-foreground">
            Even when businesses have huge potential, simply running out of cash
            can destroy them. When pockets are thin, it&apos;s time for
            investors to partner with businesses - rewarding both parties.
          </p>
        </div>
      </div>
    </section>
  );
};

export { ProblemStatement };
