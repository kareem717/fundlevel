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

export default function FilterBar() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState("");

  const industries = [
    { icon: <Smartphone className="h-5 w-5" />, label: "Technology" },
    { icon: <Cpu className="h-5 w-5" />, label: "AI & Machine Learning" },
    { icon: <Mail className="h-5 w-5" />, label: "Software & Services" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "E-commerce" },
    { icon: <Wrench className="h-5 w-5" />, label: "Manufacturing" },
    { icon: <Smartphone className="h-5 w-5" />, label: "Fintech" },
    { icon: <Cpu className="h-5 w-5" />, label: "Biotech" },
    { icon: <Mail className="h-5 w-5" />, label: "Healthcare" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Real Estate" },
    { icon: <Wrench className="h-5 w-5" />, label: "Clean Energy" },
    { icon: <Smartphone className="h-5 w-5" />, label: "Cybersecurity" },
    { icon: <Cpu className="h-5 w-5" />, label: "Cloud Computing" },
    { icon: <Mail className="h-5 w-5" />, label: "Digital Media" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Agriculture" },
    { icon: <Wrench className="h-5 w-5" />, label: "Transportation" },
  ];

  return (
    <div className="w-full py-10">
      <div className="container">
        <div className="grid grid-cols-6 gap-10 items-center w-full">
          <div className="relative max-w-md md:max-w-2xl lg:max-w-3xl mx-auto col-span-5">
            <Carousel className="w-full" opts={{ loop: true }}>
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
                      {industry.icon}
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

          <div className="flex items-center gap-2 col-span-1">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <Input
                  className="w-[200px]"
                  placeholder="Search industries..."
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilter(true)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
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
                {industry.icon}
                {industry.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
