import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  getAccountInvestmentsAction,
  getInvestmentAggregateAction,
} from "@/actions/investment";
import { Suspense } from "react";
import { PortfolioChart } from "./components/portfolio-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { CheckoutModal } from "./components/checkout-modal";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@workspace/ui/components/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { buttonVariants } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { cn } from "@workspace/ui/lib/utils";

async function InvestmentsAsync() {
  const investmentData = (
    await getAccountInvestmentsAction({
      cursor: 1,
      limit: 10,
    })
  )?.data;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Shares</TableHead>
            <TableHead className="hidden md:table-cell">
              Price per Share
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investmentData?.investments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No investments found
              </TableCell>
            </TableRow>
          ) : (
            investmentData?.investments?.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="hidden md:table-cell">
                  {format(investment.created_at, "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  ${(investment.total_usd_cent_value / 100).toLocaleString()}{" "}
                  USD
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {investment.share_quantity}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatCurrency(
                    investment.total_usd_cent_value /
                      investment.share_quantity /
                      100,
                    "USD",
                    "en-US",
                  )}{" "}
                  USD
                </TableCell>
                <TableCell>
                  {investment.status === "awaiting_confirmation" ? (
                    <Badge variant="outline">
                      <span className="hidden md:block">Awaiting Payment</span>
                      <span className="block md:hidden">Incomplete</span>
                    </Badge>
                  ) : investment.status === "round_closed" ? (
                    <Badge variant="destructive">
                      <span className="hidden md:block">Round Closed</span>
                      <span className="block md:hidden">Closed</span>
                    </Badge>
                  ) : investment.status === "awaiting_payment" ? (
                    <Badge variant="outline">Processing Payment</Badge>
                  ) : investment.status === "payment_completed" ? (
                    <Badge variant="outline">Awaiting Round Completion</Badge>
                  ) : (
                    <Badge variant="default">Completed</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {investment.status === "awaiting_confirmation" && (
                        <DropdownMenuItem>
                          <CheckoutModal
                            investmentId={investment.id}
                            amount={investment.total_usd_cent_value}
                            currency="usd"
                            triggerText="Complete Payment"
                          />
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={redirects.app.rounds(investment.round_id)}>
                          View Round
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {investmentData?.next_cursor && (
        // TODO: add pagination
        <Link href={"#"} className={cn(buttonVariants(), "w-full mt-2")}>
          View All
        </Link>
      )}
    </div>
  );
}

async function PortfolioChartAsync() {
  //todo: handle error
  const data =
    (await getInvestmentAggregateAction())?.data?.investment_aggregate ?? [];

  return <PortfolioChart data={data} className="h-full" />;
}

export default async function PortfolioPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>
            A snapshot of your current portfolio over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <PortfolioChartAsync />
          </Suspense>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
          <CardDescription>A list of your recent investments</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <InvestmentsAsync />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
