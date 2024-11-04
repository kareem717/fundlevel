"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  Smartphone,
  Cpu,
  Mail,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useAction } from "next-safe-action/hooks";
import { getAllIndustries } from "@/actions/industries";
import { useEffect, useState } from "react";
import { Industry } from "@/lib/api";
import { toast } from "sonner";

import { icons } from "lucide-react";

export default function FilterBar() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState("");
  const [industries, setIndustries] = useState<Industry[]>([]);

  const { execute, status } = useAction(getAllIndustries, {
    onSuccess: (data) => {
      setIndustries(data.data?.industries || []);
    },
    onError: (error) => {
      toast.error(error.error.serverError?.message || "Something went wrong");
    },
  });

  status === "executing";

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div className="w-full bg-background container">
      <div className="flex flex-row gap-6 items-center justify-evenly w-full max-w-4xl">
        <div className="relative flex-grow px-14">
          <Carousel
            className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-5xl"
            opts={{ loop: true, dragFree: true, duration: 15 }}
            plugins={[WheelGesturesPlugin()]}
          >
            <CarouselContent>
              {industries.map((industry, index) => (
                <CarouselItem className="basis-1/10" key={index}>
                  <button
                    className={cn(
                      "flex flex-col rounded-md bg-muted items-center justify-center p-3 gap-2 w-full h-full hover:bg-muted/80 transition-colors",
                      selectedIndustry === industry.label &&
                        "border-b-2 border-primary"
                    )}
                    onClick={() => setSelectedIndustry(industry.label)}
                  >
                    <Cpu className="h-5 w-5" />
                    <span className="text-xs">{industry.label}</span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 top-1/2 z-10 bg-gradient-to-l from-transparent via-background/90 to-background w-10 h-full -translate-y-1/2">
              <CarouselPrevious />
            </div>
            <div className="absolute right-0 top-1/2 z-10 bg-gradient-to-r from-transparent via-background/90 to-background w-10 h-full -translate-y-1/2">
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilter(true)}>
            Filter
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showFilter} onOpenChange={setShowFilter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Industries</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {industries.map((industry, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start gap-2"
              >
                <Cpu className="h-5 w-5" />
                {industry.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
