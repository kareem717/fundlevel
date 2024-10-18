import { getAccount } from "@/actions/auth";
import { getVentureById } from "@/actions/ventures";
import { NavBack } from "@/components/ui/nav-back";
import { notFound } from "next/navigation";

export default async function BusinessVentureLayout({ children, params }: { children: React.ReactNode, params: { id: string, ventureId: string } }) {
  const ventureId = parseInt(params.ventureId)
  if (isNaN(ventureId)) {
    return notFound()
  }

  const ventureResp = await getVentureById(ventureId)
  if (ventureResp?.serverError) {
    console.error(ventureResp.serverError)
    throw new Error("Failed to fetch venture")
  }

  if (!ventureResp?.data?.venture) {
    return notFound()
  }

  const accountResp = await getAccount()

  if (ventureResp.data.venture.business.ownerAccountId !== accountResp?.data?.id) {
    throw new Error("Forbidden")
  }

  return (
    <div>
      <NavBack />
      {children}
    </div>
  );
}
