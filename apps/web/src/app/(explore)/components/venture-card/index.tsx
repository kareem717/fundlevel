import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

export function VentureCard() {
  return (
    <Card className="max-w-md overflow-hidden bg-white z-10">
      <div className="p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-b from-blue-400 to-emerald-400" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              Bilal&apos;s Burgers on Bathurst
            </h2>
            <p className="text-muted-foreground">Toronto, Canada</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full">
            1/2 Investors
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            3.5% for $3005
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            Profit Share
          </Badge>
        </div>

        <Badge variant="outline" className="rounded-full">
          3 Weeks Left
        </Badge>

        <p className="text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc cursus
          ut nisl in gravida. Nunc viverra varius mauris sit amet venenatis.
          Donec integer...
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">$1,000,000</div>
            <div className="text-muted-foreground">Raising</div>
          </div>
          <div>
            <div className="text-2xl font-bold">$50,000</div>
            <div className="text-muted-foreground">Min Investment</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800">
            More Details
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" className="rounded-full">
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full">
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
