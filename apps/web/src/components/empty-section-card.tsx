import { ComponentPropsWithoutRef, FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Icons } from "./icons";
import Image from "next/image";

export interface EmptySectionCardProps extends ComponentPropsWithoutRef<"div"> {
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  button: {
    label: string;
    href: string;
  };
  icon: keyof typeof Icons;
}

export const EmptySectionCard: FC<EmptySectionCardProps> = ({
  className,
  image,
  title,
  description,
  button,
  icon,
  ...props
}) => {
  const Icon = Icons[icon];

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardContent className="grid grid-cols-4 max-h-60 grid-rows-1 p-0 overflow-hidden rounded-md">
        <div className="flex flex-col justify-center items-start w-full col-span-3 md:col-span-2 lg:col-span-1 md:pt-4">
          <Icon className="hidden md:block w-12 h-12 text-primary mx-4" />
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>{button.label}</Button>
          </CardFooter>
        </div>
        <Image
          src={image.src}
          alt={image.alt}
          width={500}
          height={500}
          className="w-full h-full object-cover md:col-span-2 lg:col-span-3"
        />
      </CardContent>
    </Card>
  );
};
