import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { DislikeButton } from "./dislike-button";
import { FavouriteButton } from "./favourite-button";
import { Venture } from "@/lib/api";
import { isVentureLiked } from "@/actions/ventures";

type VentureCardProps = {
  venture: Venture;
};

export function VentureCard({ venture }: VentureCardProps) {
  return (
    <Card className="w-full max-w-[400px] overflow-hidden bg-white z-10">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-b from-blue-400 to-emerald-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold truncate">
              {venture.name}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Toronto, Canada
              {/* {venture.business.address.city}, {venture.business.address.country} */}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge
            variant="secondary"
            className="rounded-full text-xs sm:text-sm"
          >
            1/2 Investors
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full text-xs sm:text-sm"
          >
            3.5% for $3005
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full text-xs sm:text-sm"
          >
            Profit Share
          </Badge>
        </div>

        <Badge variant="outline" className="rounded-full text-xs sm:text-sm">
          3 Weeks Left
        </Badge>

        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
          {venture.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-semibold">$1,000,000</div>
            <div className="text-sm sm:text-base text-muted-foreground">
              Raising
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-semibold">$50,000</div>
            <div className="text-sm sm:text-base text-muted-foreground">
              Min Investment
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 text-sm sm:text-base">
            More Details
          </Button>
          <div className="flex gap-1 sm:gap-2">
            <FavouriteButton ventureId={venture.id} />
            <DislikeButton />
          </div>
        </div>
      </div>
    </Card>
  );
}
