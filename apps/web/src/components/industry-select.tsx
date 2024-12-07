"use client"

import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Industry } from "@/lib/api"
import { useAction } from "next-safe-action/hooks"
import { getAllIndustries } from "@/actions/industries"
import { toast } from "sonner"
import { Icons } from "./ui/icons"

export interface IndustrySelectProps extends Omit<ComponentPropsWithoutRef<typeof Select>, "onValueChange"> {
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>
  onValueChange?: (value: number[]) => void
};


//TODO: make multi select
export const IndustrySelect: FC<IndustrySelectProps> = ({ triggerProps, onValueChange, ...props }) => {
  const [industries, setIndustries] = useState<Industry[]>([])

  const { execute, isExecuting } = useAction(getAllIndustries, {
    onSuccess: ({ data }) => {
      setIndustries(data?.industries ?? [])
    },
    onError: (error) => {
      console.error(error)
      toast.error(error.error.serverError?.message ?? "Failed to fetch industries")
    }
  })

  useEffect(() => {
    execute()
  }, [execute])


  return (
    <Select
      {...props}
      onValueChange={(value) => {
        onValueChange?.(value.split(",").map(Number))
      }}
    >
      <SelectTrigger
        className={cn(
          triggerProps?.className
        )}
        {...triggerProps}
      >
        <SelectValue placeholder="Select an industry" />
      </SelectTrigger>
      <SelectContent>
        {isExecuting ? (
          <span className="flex items-center justify-center">
            <Icons.spinner className="size-4 animate-spin" />
          </span>
        ) : (
          industries.map((industry) => (
            <SelectItem key={industry.id} value={industry.id.toString()}>
              {industry.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}

