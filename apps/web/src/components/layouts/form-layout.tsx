import { ComponentPropsWithoutRef, FC } from "react"
import { Suspense } from "../suspense";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

export interface FormLayoutProps extends ComponentPropsWithoutRef<"div"> {
  cardProps?: ComponentPropsWithoutRef<typeof Card>
  title?: string
  description?: string
};

export const FormLayout: FC<FormLayoutProps> = ({
  className,
  children,
  cardProps,
  title,
  description,
  ...props
}) => {
  return (
    <div className={cn("flex justify-center items-start h-full w-full p-2 md:pt-16", className)} {...props}>
      <Suspense orientation="portrait">
        <Card className={cn("w-full max-w-lg", cardProps?.className)} {...props}>
          <CardHeader>
            {title && (
              <CardTitle>{title}</CardTitle>
            )}
            {description && (
              <CardDescription>
                {description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
};