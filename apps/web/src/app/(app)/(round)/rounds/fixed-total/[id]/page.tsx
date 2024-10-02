import { RoundViewHero } from "@/components/app/rounds/view/hero"

export default function RoundViewPage() {
  const images = Array.from({ length: 15 }).map((_, index) => `/filler.jpeg`);

  return (
    <div className="w-full h-full">
      <RoundViewHero name="Round Name" images={images} />
    </div>
  )
}