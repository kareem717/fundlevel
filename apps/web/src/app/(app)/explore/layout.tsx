import { ReactNode } from "react"

export default function ExploreLayout({
  children,
  modal,
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <div>
      {children}
      {modal}
    </div>
  )
}