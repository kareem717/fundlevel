import { EmptySectionCard } from "@/components/app/empty-section-card"
import { Label } from "@/components/ui/label"

export default async function MyInvestmentsPage() {
  return (
    <div className="p-8 flex flex-col gap-16 justify-center items-center">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="flex flex-col gap-2 w-full" key={index}>
          <Label className="text-2xl font-bold" htmlFor={`no-rounds-card-${index}`}>
            Round Type {index + 1}
          </Label>
          <EmptySectionCard
            id={`no-rounds-card-${index}`}
            title="No investments... yet!"
            description="You don't have any investments yet. View available rounds to invest in."
            button={{
              label: "View Rounds",
              href: "/rounds",
            }}
            icon="chart"
            image={{
              src: "/filler.jpeg",
              alt: "No investments found",
            }}
          />
        </div>
      ))}
    </div>
  )
}