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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Smartphone,
  Cpu,
  Mail,
  ShoppingCart,
  Wrench,
} from "lucide-react";

export default function Component() {
  const [showSearch, setShowSearch] = React.useState(false);
  const [showFilter, setShowFilter] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const industries = [
    { icon: <Smartphone className="h-5 w-5" />, label: "Technology" },
    { icon: <Cpu className="h-5 w-5" />, label: "AI" },
    { icon: <Mail className="h-5 w-5" />, label: "Information" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Retail" },
    { icon: <Wrench className="h-5 w-5" />, label: "Construction" },
    { icon: <Smartphone className="h-5 w-5" />, label: "Technology" },
    { icon: <Cpu className="h-5 w-5" />, label: "AI" },
    { icon: <Mail className="h-5 w-5" />, label: "Information" },
    { icon: <ShoppingCart className="h-5 w-5" />, label: "Retail" },
    { icon: <Wrench className="h-5 w-5" />, label: "Construction" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full border-b">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <ScrollArea ref={scrollContainerRef} className="w-full">
            <div className="flex space-x-4 p-2">
              {industries.map((industry, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  {industry.icon}
                  {industry.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
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
