import { ComponentPropsWithoutRef, FC, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { Business } from "@workspace/sdk";
import { useAction } from "next-safe-action/hooks";
import { getBusinessesAction } from "@/actions/business";
import { useToast } from "@workspace/ui/hooks/use-toast";

interface BusinessSelectProps extends ComponentPropsWithoutRef<typeof Select> {
  triggerProps?: ComponentPropsWithoutRef<typeof SelectTrigger>;
  businesses?: Business[];
}

export function BusinessSelect({
  triggerProps,
  ...props
}: BusinessSelectProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(getBusinessesAction, {
    onSuccess: ({ data }) => {
      setBusinesses(data?.businesses || []);
    },
    onError: ({ error }) => {
      toast({
        title: "Failed to load businesses",
        description: error.serverError?.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (props.businesses) {
      setBusinesses(props.businesses);
    } else {
      execute();
    }
  }, [props.businesses, execute]);

  return (
    <Select
      defaultValue={businesses[0]?.id.toString()}
      disabled={isExecuting}
      {...props}
      onValueChange={(value) => {
        console.log(value);
        props.onValueChange?.(value);
      }}
    >
      <SelectTrigger
        className={cn("w-min", isExecuting && "opacity-50 cursor-not-allowed")}
        {...triggerProps}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {businesses.map((business) => (
          <SelectItem key={business.id} value={business.id.toString()}>
            <div className="flex items-center">
              <span className="ml-2">{business.display_name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
