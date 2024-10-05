"use client"

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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export interface RoundViewHeroProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  images: string[];
};

export const RoundViewHero: FC<RoundViewHeroProps> = ({ name, images, className, ...props }) => {
  return (
    <div className={cn("w-full flex flex-col gap-4", className)} {...props}>
      <div className="flex sm:flex-row flex-col justify-between sm:items-center">
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
          <Button variant="ghost" size="sm">
            <Icons.flag className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="underline">
              Report
            </span>
          </Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 lg:grid-rows-2 gap-2 rounded-xl overflow-hidden relative">
        {images.slice(0, useMediaQuery("(min-width: 1024px)") ? 5 : 1).map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Round image ${index}`}
            width={1000}
            height={1000}
            className={cn("w-full h-full object-cover", index === 0 ? "col-span-2 row-span-2" : "")}
          />
        ))}
        {images.length > (useMediaQuery("(min-width: 1024px)") ? 5 : 1) && (
          <Dialog>
            <DialogTrigger asChild className="absolute bottom-3 right-3">
              <Button variant="secondary" size="sm">
                <Icons.layoutGrid className="mr-2 h-4 w-4" />
                Show all {images.length} photos
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-lg w-full">
              <DialogHeader>
                <DialogTitle>Venture Photos</DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
              <Carousel className="w-[90%] mx-auto">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <Image
                        src={image}
                        alt={`Round image ${index}`}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};