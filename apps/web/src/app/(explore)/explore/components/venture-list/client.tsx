// "use client";

// import React, { useEffect, useState } from "react";
// import { Carousel, CarouselApi } from "@/components/ui/carousel";
// import { Venture } from "@repo/sdk";
// import { VentureCard } from "@/app/(explore)/explore/components/venture-card";
// import { ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

// export default function VentureListClient({
//   ventures,
// }: {
//   ventures: Venture[];
// }) {
//   const [api, setApi] = useState<CarouselApi>();
//   const [canScrollLeft, setCanScrollLeft] = useState(false);

//   useEffect(() => {
//     if (!api) return;

//     api.on("scroll", () => {
//       setCanScrollLeft(api.canScrollPrev());
//     });
//   }, [api]);

//   return (
//     <Carousel
//       className="w-full"
//       setApi={setApi}
//       opts={{
//         align: "center",
//         slidesToScroll: 1,
//         breakpoints: {
//           "(min-width: 768px)": {
//             slidesToScroll: 2,
//             align: "start",
//           },
//           "(min-width: 1024px)": {
//             slidesToScroll: 3,
//             align: "start",
//           },
//         },
//       }}
//     >
//       <CarouselContent>
//         {ventures?.map((venture) => (
//           <CarouselItem
//             key={venture.id}
//             className="basis-full md:basis-1/2 lg:basis-1/3"
//           >
//             <VentureCard venture={venture} />
//           </CarouselItem>
//         ))}
//         <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
//           <div className="h-full flex items-center justify-center">
//             <Button
//               variant="outline"
//               className="h-48 w-full flex flex-col gap-4"
//             >
//               <ArrowRight className="h-8 w-8" />
//               View More Ventures
//             </Button>
//           </div>
//         </CarouselItem>
//       </CarouselContent>
//       {canScrollLeft && (
//         <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2 md:bg-gradient-to-l md:from-transparent md:via-background/90 md:to-background md:w-12 md:h-full">
//           <CarouselPrevious className="relative md:absolute" />
//         </div>
//       )}
//       <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2 md:bg-gradient-to-r md:from-transparent md:via-background/90 md:to-background md:w-12 md:h-full">
//         <CarouselNext className="relative md:absolute" />
//       </div>
//     </Carousel>
//   );
// }
