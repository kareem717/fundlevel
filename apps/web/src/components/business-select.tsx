import { ComponentPropsWithoutRef, FC, useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Business } from "@/lib/api"
import { useAction } from "next-safe-action/hooks"
import { getAccountBusinesses } from "@/actions/busineses"
import { toast } from "sonner"

interface BusinessSelectProps extends ComponentPropsWithoutRef<typeof Select> {
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>
  businesses?: Business[]
}

export const BusinessSelect: FC<BusinessSelectProps> = ({ triggerProps, ...props }) => {
  const [businesses, setBusinesses] = useState<Business[]>([])

  const { execute, isExecuting } = useAction(getAccountBusinesses, {
    onSuccess: ({ data }) => {
      setBusinesses(data?.businesses || [])
    },
    onError: ({ error }) => {
      toast.error("Failed to load businesses", {
        description: error.serverError?.message || "An unknown error occurred",
      })
    }
  })

  useEffect(() => {
    if (props.businesses) {
      setBusinesses(props.businesses)
    } else {
      execute()
    }
  }, [props.businesses, execute])

  return (
    <Select
      defaultValue={businesses[0]?.id.toString()}
      disabled={isExecuting}
      {...props}
      onValueChange={(value) => {
        console.log(value)
        props.onValueChange?.(value)
      }}
    >
      <SelectTrigger
        className={cn(
          "w-min",
          isExecuting && "opacity-50 cursor-not-allowed"
        )}
        {...triggerProps}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {businesses.map((business) => (
          <SelectItem key={business.id} value={business.id.toString()}>
            <div className="flex items-center">
              <span className="ml-2">{business.displayName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

