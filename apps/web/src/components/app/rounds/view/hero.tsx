import { cn } from "@/lib/utils";
import Image from "next/image";
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
import { Icons } from "@/components/icons";

export interface RoundViewHeroProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  images: string[];
};


export const RoundViewHero: FC<RoundViewHeroProps> = ({ name, images, className, ...props }) => {
  return (
    <div className={cn("w-full flex flex-col gap-4", className)} {...props}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Icons.upload className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">
              Share
            </span>
          </Button>
          <Button variant="ghost" size="sm">
            <Icons.heart className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">
              Save
            </span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden relative">
        {images.slice(0, 5).map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Round image ${index}`}
            width={1000}
            height={1000}
            className={cn("w-full h-full object-cover", index === 0 ? "col-span-2 row-span-2" : "")}
          />
        ))}
        {images.length > 5 && (
          <Dialog>
            <DialogTrigger asChild className="absolute bottom-3 right-3">
              <Button variant="secondary" size="sm">
                <Icons.layoutGrid className="mr-2 h-4 w-4" />
                Show all {images.length} photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Venture Photos</DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};