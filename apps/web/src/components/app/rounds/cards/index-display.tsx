import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, FC, Children } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";

export interface RoundIndexCardDisplayProps extends ComponentPropsWithoutRef<"section"> {
  children: React.ReactNode;
  title: string;
};

export const RoundIndexCardDisplay: FC<RoundIndexCardDisplayProps> = ({ children, className, title, ...props }) => {

  return (
    <section {...props} className={cn("flex flex-col gap-4 w-full px-4", className)}>
      <h1>{title}</h1>
      <Carousel className="w-full mx-auto">
        <CarouselContent className="-ml-1">
          {Children.map(children, (child, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/5 aspect-square">
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};