"use client"

import { ComponentPropsWithoutRef, FC } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { cn } from "@repo/ui/lib/utils"

export interface ChartWrapperProps extends ComponentPropsWithoutRef<typeof Card> {
  children: React.ReactNode
  title?: string
  description?: string
  headerClassName?: string
  footerContent?: React.ReactNode
};

export const ChartWrapper: FC<ChartWrapperProps> = ({ children, title, description, footerContent, className, headerClassName, ...props }) => {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      {(title || description) && (
        <CardHeader className={cn("items-center pb-0", headerClassName)}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0 w-full h-min">
        {children}
      </CardContent>
      {footerContent && (
        <CardFooter className="flex-col gap-2 text-sm">
          {footerContent}
        </CardFooter>
      )}
    </Card>
  );
};