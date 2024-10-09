import { create } from 'zustand'

export type Business = {
  id: number
  name: string
}

interface BusinessContextState {
  selectedBusiness: Business | null
  setSelectedBusiness: (business: Business) => void
  isSelectedBusiness: (business: Business) => boolean
}

export const useBusinessContext = create<BusinessContextState>((set, get) => ({
  selectedBusiness: null,
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  isSelectedBusiness: (business: Business) => get().selectedBusiness?.id === business.id,
}))
