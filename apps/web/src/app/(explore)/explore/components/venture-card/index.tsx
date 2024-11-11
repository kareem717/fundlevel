import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { DislikeButton } from "./dislike-button";
import { FavouriteButton } from "./favourite-button";
import { Venture } from "@/lib/dev/types";
import { isVentureLiked } from "@/actions/ventures";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const getRandomGradient = (title: string) => {
  const gradients = [
    "bg-gradient-to-br from-blue-200 to-blue-400",
    "bg-gradient-to-br from-green-200 to-green-400",
    "bg-gradient-to-br from-purple-200 to-purple-400",
    "bg-gradient-to-br from-pink-200 to-pink-400",
    "bg-gradient-to-br from-yellow-200 to-yellow-400",
    "bg-gradient-to-br from-red-200 to-red-400",
    "bg-gradient-to-br from-indigo-200 to-indigo-400",
    "bg-gradient-to-br from-cyan-200 to-cyan-400",
  ];

  // Get first letter and convert to number 0-7 based on char code
  const firstChar = title.charAt(0).toLowerCase();
  const index = firstChar.charCodeAt(0) % gradients.length;

  return gradients[index];
};
export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <Link href={`/ventures/${venture.slug}`}>
      <div className="relative group flex flex-col p-6 space-y-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-colors overflow-hidden h-[400px] w-full">
        <div className="absolute top-2 right-2 z-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FavouriteButton ventureId={1} />
        </div>

        <div className="flex flex-col space-y-3">
          <div
            className={`w-12 h-12 rounded-full ${getRandomGradient(
              venture.title
            )}`}
            role="img"
            aria-label={venture.title}
          />
          <div>
            <h3 className="text-lg font-semibold">{venture.title}</h3>
          </div>
        </div>

        <p className="text-neutral-600 text-sm flex-grow">
          {venture.description}
        </p>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-col space-y-4 group-hover:opacity-0 transition-opacity duration-200">
            <span className="text-sm text-muted-foreground font-medium">
              {venture.location}
            </span>
            <div className="flex flex-wrap gap-2">
              {venture.industries.map((industry) => (
                <span
                  key={industry}
                  className="px-2 py-1 text-sm bg-neutral-100 rounded-full"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Valuation</span>
              <span className="text-sm">$10M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Asking for</span>
              <span className="text-sm">$2M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Investment</span>
              <span className="text-sm">$50K</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// type VentureCardProps = {
//   venture: Venture;
// };

// export function VentureCardOld({ venture }: VentureCardProps) {
//   return (
//     <Card className="w-full max-w-[400px] overflow-hidden bg-background z-10">
//       <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//         <div className="flex items-start gap-3 sm:gap-4">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-b from-blue-400 to-emerald-400 flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <h2 className="text-xl sm:text-2xl font-bold truncate">
//               {venture.name}
//             </h2>
//             <p className="text-sm sm:text-base text-muted-foreground">
//               Toronto, Canada
//               {/* {venture.business.address.city}, {venture.business.address.country} */}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-1.5 sm:gap-2">
//           <Badge
//             variant="secondary"
//             className="rounded-full text-xs sm:text-sm"
//           >
//             1/2 Investors
//           </Badge>
//           <Badge
//             variant="secondary"
//             className="rounded-full text-xs sm:text-sm"
//           >
//             3.5% for $3005
//           </Badge>
//           <Badge
//             variant="secondary"
//             className="rounded-full text-xs sm:text-sm"
//           >
//             Profit Share
//           </Badge>
//         </div>

//         <Badge variant="outline" className="rounded-full text-xs sm:text-sm">
//           3 Weeks Left
//         </Badge>

//         <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
//           {venture.description}
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//           <div>
//             <div className="text-xl sm:text-2xl font-semibold">$1,000,000</div>
//             <div className="text-sm sm:text-base text-muted-foreground">
//               Raising
//             </div>
//           </div>
//           <div>
//             <div className="text-xl sm:text-2xl font-semibold">$50,000</div>
//             <div className="text-sm sm:text-base text-muted-foreground">
//               Min Investment
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-4">
//           <Link
//             href={`/ventures/${venture.id}`}
//             className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
//           >
//             More Details
//           </Link>
//           <div className="flex gap-1 sm:gap-2">
//             <FavouriteButton ventureId={venture.id} />
//             <DislikeButton />
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }
