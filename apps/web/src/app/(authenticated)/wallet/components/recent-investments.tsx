import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { faker } from '@faker-js/faker';
import { Badge } from "@repo/ui/components/badge";

const recentInvestments = Array.from({ length: 25 }, (_, id) => ({
  id: id + 1,
  venture: faker.company.name(),
  amount: faker.finance.amount({ min: 1000, max: 10000, dec: 2 }),
  type: faker.helpers.arrayElement(["Completed", "Pending", "Withdrawn"]),
  date: faker.date.past().toISOString().split('T')[0],
}));

export interface RecentInvestmentsListProps extends ComponentPropsWithoutRef<typeof ScrollArea> {

};

export const RecentInvestmentsList: FC<RecentInvestmentsListProps> = ({ className, ...props }) => {
  return (
    <ScrollArea className={cn("space-y-4", className)} type="scroll" {...props} >
      {recentInvestments.map((investment) => (
        <div key={investment.id} className="flex items-center justify-between pb-4 border-b last:border-0">
          <div className="space-y-1">
            <p className="text-sm font-medium">{investment.venture}</p>
            <p className="text-xs text-muted-foreground">{investment.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">${investment.amount.toLocaleString()}</span>
            {(() => {
              switch (investment.type) {
                case "Completed":
                  return <Badge>Completed</Badge>;
                case "Pending":
                  return <Badge variant="outline">Pending</Badge>;
                default:
                  return <Badge variant="destructive">Withdrawn</Badge>;
              }
            })()}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};