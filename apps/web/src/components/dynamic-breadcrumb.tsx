"use client";

import { ComponentPropsWithoutRef, FC } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@fundlevel/ui/components/breadcrumb";

export type DynamicBreadcrumbItem = {
  title: string;
  url?: string;
};

export interface DynamicBreadcrumbProps
  extends ComponentPropsWithoutRef<typeof Breadcrumb> {
  items: DynamicBreadcrumbItem[];
}

export const DynamicBreadcrumb: FC<DynamicBreadcrumbProps> = ({
  className,
  items,
  ...props
}) => {
  return (
    <Breadcrumb className={className} {...props}>
      <BreadcrumbList>
        {items.slice(0, -1).map((item, index) => (
          <>
            {item.url ? (
              <BreadcrumbLink
                key={index}
                className="hidden md:block"
                href={item.url}
              >
                {item.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbItem key={index} className="hidden md:block">
                {item.title}
              </BreadcrumbItem>
            )}
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        ))}
        <BreadcrumbItem key={items.length - 1}>
          {items[items.length - 1]?.url ? (
            <BreadcrumbLink
              className="hidden md:block"
              href={items[items.length - 1]?.url}
            >
              {items[items.length - 1]?.title}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbItem className="hidden md:block">
              {items[items.length - 1]?.title}
            </BreadcrumbItem>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
