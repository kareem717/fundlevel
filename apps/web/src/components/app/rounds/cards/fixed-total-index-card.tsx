import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FixedTotalRound } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"

export interface FixedTotalRoundIndexCardProps extends ComponentPropsWithoutRef<typeof Card> {
  round: FixedTotalRound
};

export const FixedTotalRoundIndexCard: FC<FixedTotalRoundIndexCardProps> = ({ round, className, ...props }) => {
  return (
    <Card {...props} className={cn("flex flex-col gap-4", className)} >
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};