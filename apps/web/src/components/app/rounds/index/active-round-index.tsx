// "use client"

// import { ComponentPropsWithoutRef, FC, useEffect, useState } from "react"
// import { Label } from "@/components/ui/label"
// import { EmptySectionCard } from "@/components/app/empty-section-card"
// import { cn } from "@/lib/utils"
// import { useAction } from "next-safe-action/hooks"
// import { RoundWithSubtypes } from "@/lib/api"
// import { getAccountRounds } from "@/actions/rounds"
// import { toast } from "sonner"
// import { useInView } from "react-intersection-observer"
// import { Icons } from "@/components/ui/icons"
// import { Card, CardContent } from "@/components/ui/card"
// import { RoundIndexCard } from "../index-card"

// export interface ActiveRoundIndexProps extends ComponentPropsWithoutRef<"div"> {

// };

// export const ActiveRoundIndex: FC<ActiveRoundIndexProps> = ({ className, ...props }) => {
//   const [rounds, setRounds] = useState<RoundWithSubtypes[]>([])
//   const [cursor, setCursor] = useState(1)
//   const [hasMore, setHasMore] = useState(true)

//   const { executeAsync, isExecuting, hasSucceeded } = useAction(getAccountRounds, {
//     onSuccess: ({ data }) => {
//       const newData = data?.roundsWithSubtypes ?? []
//       setRounds((prevData) => [...prevData, ...newData])
//       if (data?.nextCursor) {
//         setCursor(data.nextCursor)
//       } else {
//         setHasMore(false) // Set cursor to null if no more data
//       }
//     },
//     onError: (error) => {
//       toast.error("Error fetching partial total rounds")
//       console.error("Error fetching partial total rounds:", error)
//     }
//   })

//   const loadMore = async (cursorParam?: number) => {
//     try {
//       if (hasMore) {
//         await executeAsync({
//           paginationRequestSchema: { cursor: cursorParam ?? cursor, limit: 10 },
//           status: ["active"]
//         })
//       }
//     } catch (error) {
//       console.error('Error fetching more data:', error)
//     }
//   }

//   const [ref, inView] = useInView({
//     threshold: 1,
//   })


//   useEffect(() => {
//     if (inView && !isExecuting) {
//       loadMore()
//     }
//   }, [inView])

//   console.log(rounds)
//   return (
//     <div className={cn("flex flex-col gap-2 w-full", className)} {...props}>
//       <Label className="text-2xl font-bold" htmlFor={`active-rounds-index`}>
//         Active
//       </Label>
//       {!hasMore && rounds.length === 0 ? (
//         <EmptySectionCard
//           id={`active-rounds-index`}
//           title="No active rounds"
//           description="None of your rounds are active yet."
//           button={{
//             label: "Upgrade",
//             href: "/rounds/create",
//           }}
//           icon="chart"
//           image={{
//             src: "/filler.jpeg",
//             alt: "No active rounds",
//           }}
//         />
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto overflow-y-auto">
//           {rounds.map((round) => (
//             <RoundIndexCard key={round.id} round={round} className="w-full aspect-square" />
//           ))}
//           {hasMore ? (
//             <div ref={ref} className="h-10 flex items-center justify-center">
//               {isExecuting && <Icons.spinner className="h-6 w-6 animate-spin" />}
//             </div>
//           ) : (
//             <div className="h-10 flex items-center justify-center">
//               <p>No more data</p>
//             </div>
//           )}
//         </div>

//       )}

//     </div>
//   );
// };