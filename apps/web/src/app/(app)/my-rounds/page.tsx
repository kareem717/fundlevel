import { EmptySectionCard } from "@/components/app/empty-section-card"
import { Label } from "@/components/ui/label"

export default async function MyRoundsPage() {
  return (
    <div className="p-8 flex flex-col gap-16 justify-center items-center">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="flex flex-col gap-2 w-full" key={index}>
          <Label className="text-2xl font-bold" htmlFor={`no-rounds-card-${index}`}>
            Round Type {index + 1}
          </Label> 
          <EmptySectionCard
            id={`no-rounds-card-${index}`}
            title="No rounds found"
            description="You don't have any rounds yet. Create one to get started."
            button={{
              label: "Create Round",
              href: "/rounds/create",
            }}
            icon="add"
            image={{
              src: "/filler.jpeg",
              alt: "No rounds found",
            }}
          />
        </div>
      ))}
    </div>
  )
}