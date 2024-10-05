import { ComponentPropsWithoutRef, FC } from "react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { PatternBackground } from "@/components/app/pattern-background";
import { timeSince, cn } from "@/lib/utils";
import { RoundInvestment } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { ManageInvestmentDialog } from "./manage-investment-dialog";

export interface InvestmentIndexCardProps extends ComponentPropsWithoutRef<"div"> {
  investment: RoundInvestment
};

export const InvestmentIndexCard: FC<InvestmentIndexCardProps> = ({ investment, className, ...props }) => {
  const { createdAt, investorId } = investment
  const { account } = useAuth()

  return (
    <Card className={cn("w-full", className)}>
      <PatternBackground hash={createdAt.toString()} />
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">{investment.roundId}</h3>
        <h3 className="text-lg font-semibold">{investment.amount}</h3>
      </CardHeader>
      <CardContent>
        <span className="text-xs text-muted-foreground">
          Created {timeSince(createdAt)}
        </span>
      </CardContent>
      <CardFooter>
        {account?.id === investorId && (
          <ManageInvestmentDialog investment={investment} />
        )}
      </CardFooter>
    </Card>
  );
};