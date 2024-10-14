import { notFound } from "next/navigation";

export default function BusinessVentureLayout({ children, params }: { children: React.ReactNode, params: { id: string, ventureId: string } }) {
  const ventureId = parseInt(params.ventureId)
  if (isNaN(ventureId)) {
    return notFound()
  }

  // TODO: handle venture verification

  return (
    <div>
      {children}
    </div>
  );
}
