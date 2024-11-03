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
        <h2 className="text-2xl font-semibold mb-6 md:mb-8">{title}</h2>
        <div className="relative">
          <Carousel
            className="w-full"
            setApi={setApi}
            opts={{
              align: "start",
            }}
          >
            <CarouselContent>
              {ventures?.map((venture) => (
                <CarouselItem key={venture.id} className="md:basis-1/3">
                  <VentureCard venture={venture} />
                </CarouselItem>
              ))}
              <CarouselItem className="sm:basis-1/2 md:basis-1/3">
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
              <div className="absolute left-0 top-1/2 z-10 bg-gradient-to-l from-transparent via-background/90 to-background w-12 h-full -translate-y-1/2">
                <CarouselPrevious />
              </div>
            )}
            <div className="absolute right-0 top-1/2 z-10 bg-gradient-to-r from-transparent via-background/90 to-background w-12 h-full -translate-y-1/2">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
