import { useState } from "react";

export function useActiveIndex() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)


  return {
    activeIndex,
    setActiveIndex,
  }
}
