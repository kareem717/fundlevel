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
  ArrowRight,
  ArrowLeft,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="block w-full relative h-[107px] lg:h-10 px-8 pt-4">
      <div className="flex flex-row flex-wrap items-center justify-between w-full h-[107px] lg:h-10">
        <div className="relative">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative block overflow-x-auto overflow-y-hidden pt-4 lg:pt-0 text-center order-3 lg:order-none border-t lg:border-none">
          <span className="absolute left-0 top-1/2 -translate-y-1/2">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </span>
          <ul className="flex gap-2 text-nowrap scroll-smooth overflow-x-auto overflow-y-hidden h-9 w-[708px] lg:w-auto">
            {industries.map((industry, index) => (
              <li key={index} className="inline-block list-none">
                {industry.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <Button variant="outline" onClick={() => setShowFilter(true)}>
            Filter
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* <div className="flex flex-row gap-6 items-center justify-between w-full max-w-4xl">
        <div className="relative flex-grow px-14 hidden md:block">
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

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          
        </div>
      </div> */}

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
                onClick={() => {
                  setSelectedIndustry(industry.label);
                  setShowFilter(false);
                }}
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
