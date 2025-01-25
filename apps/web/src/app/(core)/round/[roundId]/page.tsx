import { FormPageLayout } from "@/components/layouts/form-page-layout";
import { LogoDiv } from "@/components/logo-div";
import { InvestForm } from "./components/invest-form";
import { getRoundAction } from "@/actions/round";
import { notFound } from "next/navigation";
import { getBusinessAction } from "@/actions/business";
import Link from "next/link";
import { redirects } from "@/lib/config/redirects";
import { buttonVariants } from "@repo/ui/components/button";

export default async function RoundPage({ params }: { params: { roundId: string } }) {
  const { roundId } = await params
  const parsedRoundId = parseInt(roundId)

  if (isNaN(parsedRoundId)) {
    return notFound()
  }

  //TODO: handle error
  const roundResponse = await getRoundAction(parsedRoundId)
  const round = roundResponse?.data

  if (!round) {
    console.error("Round not found", roundResponse)
    return notFound()
  }

  // TODO: handle error
  const businessResponse = await getBusinessAction(round.business_id)
  const business = businessResponse?.data?.business

  if (!business) {
    console.error("Business not found", businessResponse)
    return notFound()
  }

  return (
    <FormPageLayout>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <LogoDiv className="self-center w-40" />
        <InvestForm round={round} business={business} />
        {/* TODO: just for testing */}
        <div className="grid grid-cols-2 gap-4 max-w-md self-center">
          <Link href={redirects.auth.login} className={buttonVariants()}>
            Login
          </Link>
          <Link href={redirects.auth.createAccount} className={buttonVariants()}  >
            Create Account
          </Link>
        </div>
      </div>
    </FormPageLayout>
  )
}
