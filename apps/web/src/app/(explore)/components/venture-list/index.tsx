"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { VentureCard } from "../venture-card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Venture } from "@/lib/api";

type VentureListProps = {
  title: string;
  ventures: Venture[];
};

export function VentureList({ title, ventures }: VentureListProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  useEffect(() => {
    if (!api) return;

    api.on("scroll", () => {
      setCanScrollLeft(api.canScrollPrev());
    });
  }, [api]);

  return (
    <div className="w-full py-6">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-6 md:mb-8 text-center md:text-left">
          {title}
        </h2>
        <div className="relative max-w-[400px] md:max-w-none mx-auto">
          <Carousel
            className="w-full"
            setApi={setApi}
            opts={{
              align: "center",
              slidesToScroll: 1,
              breakpoints: {
                "(min-width: 768px)": {
                  slidesToScroll: 2,
                  align: "start",
                },
                "(min-width: 1024px)": {
                  slidesToScroll: 3,
                  align: "start",
                },
              },
            }}
          >
            <CarouselContent>
              {ventures?.map((venture) => (
                <CarouselItem
                  key={venture.id}
                  className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <VentureCard venture={venture} />
                </CarouselItem>
              ))}
              <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                <div className="h-full flex items-center justify-center">
                  <Button
                    variant="outline"
                    className="h-48 w-full flex flex-col gap-4"
                  >
                    <ArrowRight className="h-8 w-8" />
                    View More Ventures
                  </Button>
                </div>
              </CarouselItem>
            </CarouselContent>
            {canScrollLeft && (
              <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 md:bg-gradient-to-l md:from-transparent md:via-background/90 md:to-background md:w-12 md:h-full">
                <CarouselPrevious className="relative md:absolute" />
              </div>
            )}
            <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2 md:bg-gradient-to-r md:from-transparent md:via-background/90 md:to-background md:w-12 md:h-full">
              <CarouselNext className="relative md:absolute" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
