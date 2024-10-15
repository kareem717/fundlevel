"use client"

import { useExploreNavbarStore } from "./components/use-explore-navbar"

export default function ExplorePage() {
  const { resource } = useExploreNavbarStore()

  return (
    <div>
      {resource}
    </div>
  );
}
