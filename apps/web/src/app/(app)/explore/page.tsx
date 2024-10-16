"use client"

import { useExploreNavbarStore } from "./components/use-explore-navbar"
import { RoundIndex } from "./components/round-index"
import { VentureIndex, VentureIndexCard } from "./components/venture-index"
import { faker } from "@faker-js/faker"

export default function ExplorePage() {
  const { resource } = useExploreNavbarStore()

  if (resource === "Rounds") {
    return <RoundIndex />
  } else if (resource === "Ventures") {
    return <VentureIndex />
  }
}
