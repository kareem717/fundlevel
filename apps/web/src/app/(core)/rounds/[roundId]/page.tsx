import { FormPageLayout } from "@/components/layouts/form-page-layout";
import { LogoDiv } from "@/components/logo-div";
import { InvestForm } from "./components/invest-form";
import { getPublicRoundAction, getRoundTermsAction } from "@/actions/round";
import { notFound } from "next/navigation";
import { getPublicBusinessAction } from "@/actions/business";
import { getActiveRoundInvestmentAction } from "@/actions/investment";

export default async function RoundPage({ params }: { params: { roundId: string } }) {
  const { roundId } = await params
  const parsedRoundId = parseInt(roundId)

  if (isNaN(parsedRoundId)) {
    return notFound()
  }

  const activeInvestment = (await getActiveRoundInvestmentAction(parsedRoundId))?.data?.investment

  //TODO: handle error
  const round = (await getPublicRoundAction(parsedRoundId))?.data
  if (!round) {
    console.error("Round not found", round)
    return notFound()
  }

  // TODO: handle error
  const business = (await getPublicBusinessAction(round.business_id))?.data?.business
  if (!business) {
    console.error("Business not found", business)
    return notFound()
  }

  const terms = (await getRoundTermsAction(parsedRoundId))?.data

  if (!terms) {
    console.error("Terms not found", terms)
    return notFound()
  }


  return (
    <FormPageLayout>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <LogoDiv className="self-center w-40" />
        <InvestForm
          round={round}
          business={business}
          terms={terms}
          defaultShareQuantity={activeInvestment?.share_quantity}
        />
      </div>
    </FormPageLayout>
  )
}
