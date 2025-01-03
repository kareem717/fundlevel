import { Icons } from "@/components/icons";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import { faker } from '@faker-js/faker';
import { Badge } from "@repo/ui/components/badge";

const recentPayments = Array.from({ length: 25 }, (_, id) => ({
  id: id + 1,
  type: faker.helpers.arrayElement(["Deposit", "Withdrawal", "Dividend"]),
  amount: faker.finance.amount({
    min: 100,
    max: 10000,
    dec: 2,
  }),
  status: faker.helpers.arrayElement(["Inbound", "Outbound"]),
  date: faker.date.past().toISOString().split('T')[0],
}));


export interface RecentTransactionsListProps extends ComponentPropsWithoutRef<typeof ScrollArea> {

};
export const RecentTransactionsList: FC<RecentTransactionsListProps> = ({ className, ...props }) => {
  return (
    <ScrollArea className={cn("space-y-4", className)} type="scroll"{...props} >
      {recentPayments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between pb-4 border-b last:border-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Icons.dollarSign className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{payment.type}</p>
            </div>
            <p className="text-xs text-muted-foreground">{payment.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">${payment.amount.toLocaleString()}</span>
            <Badge
              className={`${payment.status === "Inbound"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {payment.status}
            </Badge>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};