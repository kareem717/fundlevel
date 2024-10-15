import { create } from "zustand";

export type ExploreResource = "Ventures" | "Rounds"

interface ExploreNavbarState {
  resource: ExploreResource;
  setResource: (resource: ExploreResource) => void;
}

export const useExploreNavbarStore = create<ExploreNavbarState>((set) => ({
  resource: "Ventures",
  setResource: (resource) => set({ resource }),
}));
