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
// import { Industry } from "@/lib/api";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Industry } from "@/lib/dev/types";
import { icons } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DualRangeSlider } from "@/components/ui/range-slider";
import {
  parseAsArrayOf,
  useQueryState,
  parseAsInteger,
  parseAsString,
} from "nuqs";
import { industries } from "@/lib/dev/config";

export default function FilterBar() {
  // const { execute, status } = useAction(getAllIndustries, {
  //   onSuccess: (data) => {
  //     setIndustries(data.data?.industries || []);
  //   },
  //   onError: (error) => {
  //     toast.error(error.error.serverError?.message || "Something went wrong");
  //   },
  // });

  const [list, setList] = useQueryState("list", {
    parse: (value) => value || "featured",
    defaultValue: "featured",
    clearOnDefault: false,
  });

  const [industriesState, setIndustriesState] = useState<
    { label: Industry; value: string }[]
  >([]);

  const [showFilter, setShowFilter] = React.useState(false);
  const [values, setValues] = useState([100, 1000000]);

  const formatValue = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handleIndustryChange = (industry: string) => {
    const currentIndustries = filterIndustries || [];

    const isSelected = currentIndustries.includes(industry);

    if (isSelected) {
      setFilterIndustries(currentIndustries.filter((ind) => ind !== industry));
    } else {
      setFilterIndustries([...currentIndustries, industry]);
    }
  };

  const [filterIndustries, setFilterIndustries] = useQueryState(
    "industries",
    parseAsArrayOf<string>({
      parse: (value) => value,
      serialize: (value) => value,
    })
  );

  useEffect(() => {
    // Map all possible Industry types to industry objects
    const industryList = industries.map((industry) => ({
      label: industry,
      value: industry.toLowerCase(),
    }));

    setIndustriesState(industryList);
  }, []);

  return (
    <div className="block w-full relative h-[107px] lg:h-10 px-8 pt-4">
      <div className="flex flex-row flex-wrap items-center justify-between w-full h-[107px] lg:h-10 gap-4 container">
        <div className="relative">
          <Select onValueChange={(value) => setList(value)} defaultValue={list}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select List" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Lists</SelectLabel>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="aquired">Aquired</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative pt-4 lg:pt-0 text-center order-3 lg:order-none border-t lg:border-none hidden md:block">
          <Carousel
            className="max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-10"
            opts={{ loop: true, dragFree: true, duration: 15 }}
            plugins={[WheelGesturesPlugin()]}
          >
            <CarouselContent>
              {industriesState.map((industry, index) => (
                <CarouselItem className="basis-1/10" key={index}>
                  <button
                    className={cn(
                      "flex flex-col rounded-md bg-muted items-center justify-center p-3 gap-2 w-full h-full hover:bg-muted/80 transition-colors",
                      filterIndustries?.includes(industry.value) &&
                        "border-b-2 border-primary"
                    )}
                    onClick={() => handleIndustryChange(industry.value)}
                  >
                    <span className="text-xs">{industry.label}</span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-transparent via-background/90 to-background w-6 h-full ">
              <CarouselPrevious />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-transparent via-background/90 to-background w-6 h-full ">
              <CarouselNext />
            </div>
          </Carousel>
        </div>

        <div className="relative">
          <Button variant="outline" onClick={() => setShowFilter(true)}>
            Filter
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showFilter} onOpenChange={setShowFilter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Industries</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-6">
              <div className="space-y-8">
                <Label>Investment Amount Range</Label>
                <div className="flex items-center gap-4">
                  <DualRangeSlider
                    label={(value) => <span>{formatValue(value || 100)}</span>}
                    value={values}
                    onValueChange={setValues}
                    min={100}
                    max={1000000}
                    step={1}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$1,000</span>
                  <span>$1,000,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Investment Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="equity" />
                    <label htmlFor="equity">Equity</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="debt" />
                    <label htmlFor="debt">Debt</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="revenue" />
                    <label htmlFor="revenue">Revenue Share</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="convertible" />
                    <label htmlFor="convertible">Convertible Note</label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business Stage</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="early">Early Revenue</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="mature">Mature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Campaign End Date</Label>
                <div className="grid gap-2">{/* <DatePicker /> */}</div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="eu">European Union</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowFilter(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Filters applied");
                    setShowFilter(false);
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
