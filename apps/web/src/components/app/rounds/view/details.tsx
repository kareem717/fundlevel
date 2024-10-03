import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type BasicDetails = {
  location: string;
  amountSeeking: string;
  industry: string;
  focus: string;
};

type RoundLead = {
  name: string;
  title: string;
  description: string;
};

type VentureDetails = {
  overview: string;
  team: string;
  previousFunding?: string;
};

export interface RoundViewDetailsProps extends ComponentPropsWithoutRef<"div"> {
  basicDetails: BasicDetails;
  roundLead: RoundLead;
  ventureDetails: VentureDetails;
  description: string;
};

export const RoundViewDetails: FC<RoundViewDetailsProps> = ({ className, basicDetails, roundLead, ventureDetails, description, ...props }) => {
  const truncate = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const isLargeDescription = description.length > 150;

  return (
    <div className={cn("w-full flex flex-col divide-y px-2", className)} {...props}>
      <div className="flex flex-col gap-8 py-4">
        <div className="flex flex-col gap-1 text-xl font-semibold">
          Round in {basicDetails.location}
          <span className="text-muted-foreground text-sm font-normal">
            Seeking {basicDetails.amountSeeking} - {basicDetails.industry} Industry - {basicDetails.focus} Focus
          </span>
        </div>
        <div className="flex flex-col gap-1 font-semibold">
          Lead by {roundLead.name}
          <span className="text-muted-foreground text-xs font-normal">
            {roundLead.title} - {roundLead.description}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-8 items-start justify-center py-4">
        <div className="flex gap-4 items-center justify-start">
          <Icons.building className="w-9 h-9 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            Company Overview
            <span className="text-muted-foreground">
              {ventureDetails.overview}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-start">
          <Icons.users className="w-9 h-9 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            Team Size
            <span className="text-muted-foreground">
              {ventureDetails.team}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center justify-start">
          <Icons.briefcase className="w-9 h-9 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            Previous funding
            <span className="text-muted-foreground">
              {ventureDetails.previousFunding}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 items-start justify-start py-4">
        <p>
          {truncate(description, 350)}
        </p>
        {isLargeDescription && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <span className="text-xs underline">
                  Show more
                </span>
                <Icons.chevronRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="max-h-[70vh] w-full overflow-y-auto">
                <ScrollArea className="h-full w-full">
                  {description}
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};