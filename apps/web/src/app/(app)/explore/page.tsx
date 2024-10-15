"use client"

import { useExploreNavbarStore } from "./components/use-explore-navbar"
import { RoundIndex } from "./components/round-index"
import { VentureIndex, VentureIndexCard } from "./components/venture-index"
import { faker } from "@faker-js/faker"

export default function ExplorePage() {
  const { resource } = useExploreNavbarStore()

  const ventures: VentureIndexCard[] = Array.from({ length: 10 }).map(() => ({
    ventureId: faker.number.int().toString(),
    name: faker.company.name(),
    createdAt: faker.date.past(),
    href: faker.internet.url(),
  }));

  if (resource === "Rounds") {
    return <RoundIndex rounds={[]} />
  } else if (resource === "Ventures") {
    return <VentureIndex ventures={ventures} />
  }
}
