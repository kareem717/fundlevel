"use client";

import { ComponentPropsWithoutRef, FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { AddressAutofill } from "@mapbox/search-js-react";
import { env } from "@/env";
import type { AddressAutofillRetrieveResponse } from "@mapbox/search-js-core";
import { cn } from "@/lib/utils";
import { createAddressSchema } from "@/actions/validations/address";
import { InferType } from "yup";
import { toast } from "sonner";

interface AddressInputProps extends ComponentPropsWithoutRef<typeof Input> {
  onRetrieve?: (val: InferType<typeof createAddressSchema>) => void;
}

export const useAddressInput = () => {
  const [address, setAddress] = useState<InferType<typeof createAddressSchema> | null>(null);
  return { address, setAddress };
};

export const AddressInput: FC<AddressInputProps> = ({
  className,
  onRetrieve,
  ...props
}) => {
  const { setAddress } = useAddressInput();

  const handleRetrieve = (res: AddressAutofillRetrieveResponse) => {
    const vals = res?.features[0]?.properties;
    const geo = res?.features[0]?.geometry;

    if (!vals || !geo) {
      throw new Error("No address found");
    }

    try {
      const parse = createAddressSchema.validateSync({
        postalCode: vals.postcode,
        xCoordinate: String(geo.coordinates[0]),
        yCoordinate: String(geo.coordinates[1]),
        line1: vals.address_line1,
        line2: vals.address_line2,
        // @ts-ignore
        city: vals.place,
        // @ts-ignore
        region: vals.region,
        // @ts-ignore
        regionCode: vals.region_code,
        country: vals.country,
        fullAddress: vals.full_address || vals.place_name,
        rawJson: res,
        // @ts-ignore
        district: vals.district,
      });
      setAddress(parse);
      onRetrieve?.(parse);
    } catch (error) {
      console.error(error);
      toast.error("Invalid address");
    }

  };

  return (
    <>
      {/* @ts-ignore */}
      <AddressAutofill
        accessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onRetrieve={handleRetrieve}
        theme={{
          variables: {
            colorBackground: "hsl(var(--muted))",
            colorBackgroundHover: "hsl(var(--primary))",
            colorBackgroundActive: "hsl(var(--primary))",
            colorText: "hsl(var(--text))",
            colorSecondary: "hsl(var(--accent-foreground))",
          },
        }}
      >
        {
          (
            <Input
              name="address"
              autoComplete="address-line1"
              placeholder="Begin to enter an address..."
              className={cn("bg-background", className)}
              {...props}
            />
          ) as any
        }
      </AddressAutofill>
    </>
  );
};

