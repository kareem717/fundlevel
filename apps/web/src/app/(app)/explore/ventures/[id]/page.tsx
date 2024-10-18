import { VentureViewActions } from "./components/venture-view-actions"
import { getVentureById, isVentureLiked } from "@/actions/ventures";
import { notFound } from "next/navigation";
import { getAccount } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { cn, truncateText } from "@/lib/utils";
import { BusinessOverview } from "@/components/ui/business-overview";

export default async function VentureViewPage({ params }: { params: { id: string } }) {
  const parsedId = parseInt(params.id as string || ""); // Parse the id
  if (isNaN(parsedId)) {
    notFound();
  }

  const ventureResp = await getVentureById(parsedId)
  if (!ventureResp?.data || ventureResp?.serverError) {
    console.error(ventureResp)
    throw new Error("Something went wrong")
  }

  const { business, ...venture } = ventureResp.data.venture

  const accountResp = await getAccount();
  const account = accountResp?.data;

  let isLiked = false;
  if (account) {
    const isLikedResp = await isVentureLiked(venture.id);
    isLiked = isLikedResp?.data?.liked ?? false;
  }

  return (
    <Card className="w-full relative max-w-screen-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between w-full">
          {venture.name}
          <VentureViewActions ventureId={venture.id} />
        </CardTitle>
        <CardDescription>
          <span className="text-muted-foreground text-sm font-normal">
            {/* Seeking {round.percentageValue} for {round.percentageOffered} through {round.investorCount} investors{round.investorCount > 1 ? "s" : ""} */}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 ">
        <div className="w-full flex flex-col lg:flex-row gap-4 h-full">
          <div className={cn("w-full flex flex-col px-2 lg:w-2/3 gap-4")}>
            <div className="flex flex-col gap-1 font-semibold">
              By {business.name}
            </div>
            <Separator className="w-full" />
            <BusinessOverview
              overview={venture.overview}
              teamSize={business.teamSize}
              businessId={business.id}
            />
            <Separator className="w-full" />
            <div className="flex flex-col items-start justify-start">
              <p>
                {truncateText(venture.description, 350)}
              </p>
              {venture.description.length > 150 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-4">
                      <span className="text-xs underline">
                        Show more
                      </span>
                      <Icons.chevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <div className="max-w-screen-lg px-2">
                    <DialogContent className="rounded-md">
                      <DialogHeader>
                        <DialogTitle>Venture Description</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[70dvh] w-full h-full">
                        <ScrollArea className="h-full w-full">
                          {venture.description}
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </div>
                </Dialog>
              )}
            </div>
          </div>
          <Card className={cn("w-full h-full hidden md:block lg:w-1/3")}>
            <CardHeader>
              <CardTitle>Round</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              this is where we display the active round
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}