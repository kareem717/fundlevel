"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { ExploreResource, useExploreNavbarStore } from "./use-explore-navbar"

export interface ExploreSearchProps extends ComponentPropsWithoutRef<"nav"> {
  default?: ExploreResource
};

const RoundSearch: FC<ComponentPropsWithoutRef<"div">> = ({ className, ...props }) => {
  return (
    <div className={cn("rounded-md border flex items-center justify-center gap-2 p-2", className)} {...props}>
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum Investment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6" />
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum Investment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6" />
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum Investment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Link href="#">
        <Button size="icon">
          <Icons.search className="size-5" />
        </Button>
      </Link>
    </div>
  )
}

const VentureSearch: FC<ComponentPropsWithoutRef<"div">> = ({ className, ...props }) => {
  return (
    <div className={cn("rounded-md border flex items-center justify-center gap-2 p-2", className)} {...props}>
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum 3" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6" />
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum 2" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-6" />
      <Select>
        <SelectTrigger className="border-none hover:bg-muted">
          <SelectValue placeholder="Minimum 1" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">$100</SelectItem>
          <SelectItem value="dark">$500</SelectItem>
          <SelectItem value="system">$1000</SelectItem>
        </SelectContent>
      </Select>
      <Link href="#">
        <Button size="icon">
          <Icons.search className="size-5" />
        </Button>
      </Link>
    </div>
  )
}


export const ExploreSearch: FC<ExploreSearchProps> = ({ className, default: defaultResource, ...props }) => {
  const { resource } = useExploreNavbarStore()

  return (
    <nav className={cn("flex flex-col items-center gap-6", className)} {...props}>
      {resource === "Ventures" ? <VentureSearch /> : <RoundSearch />}
    </nav>
  );
};