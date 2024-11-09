import { NavBack } from "@/components/nav-back"

export default function RoundViewLayout({
  children,
  // modal
}: {
  children: React.ReactNode,
  // modal: React.ReactNode
}) {
  return (
    <div className="p-4 space-y-4">
      <NavBack />
      <div className="h-full w-full relative pb-14 md:pb-20">
        {children}
        {/* {modal} */}
      </div>
    </div >
  )
}