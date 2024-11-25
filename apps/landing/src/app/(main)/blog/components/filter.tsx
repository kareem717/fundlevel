"use client";

import { ComponentPropsWithoutRef, FC } from "react";
import { BlogCategory } from "@/payload-types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useQueryStates } from "nuqs";
import { blogFiltersParsers } from "./searchParams";
import { cn } from "@/lib/utils";

export interface BlogFiltersProps
  extends ComponentPropsWithoutRef<"div"> {
  categories: BlogCategory[];
}

export const BlogFilters: FC<BlogFiltersProps> = ({
  categories,
  className,
  ...props
}) => {
  const [{ category: currentCategory }, setCurrentCategory] =
    useQueryStates(blogFiltersParsers);

  return (
    <div className={cn("container", className)} {...props}>
      <div className="hidden md:flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => setCurrentCategory({ category: "all" })}
          className={clsx(
            "p-7 text-lg rounded-none hover:text-white",
            currentCategory === "all"
              ? "bg-primary text-white"
              : "bg-gray-200 text-black"
          )}
          variant="default"
          size="lg"
        >
          All
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setCurrentCategory({ category: category.slug })}
            className={clsx(
              "p-7 text-lg rounded-none hover:text-white",
              currentCategory === category.slug
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            )}
            variant="default"
            size="lg"
          >
            {category.title}
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Select
          onValueChange={(value) => setCurrentCategory({ category: value })}
          defaultValue="all"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug ?? ""}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
