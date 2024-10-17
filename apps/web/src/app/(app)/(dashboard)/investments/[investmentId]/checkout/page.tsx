import { getInvestmentById } from "@/actions/investments"
import { InvestmentCheckoutDisclaimer } from "./components/investment-checkout-disclaimer"
import { notFound } from "next/navigation"
import { FormLayout } from "@/components/layouts/form-layout"

export default async function InvestmentCheckoutPage({ params }: { params: { investmentId: string } }) {
  const investmentId = parseInt(params.investmentId)
  if (isNaN(investmentId)) {
    throw notFound()
  }

  const investmentResp = await getInvestmentById(investmentId)

  if (investmentResp?.serverError) {
    console.error(investmentResp)
    throw new Error("Something went wrong")
  }

  if (!investmentResp?.data) {
    throw notFound()
  }

  const investment = investmentResp.data.investment

  return (
    <FormLayout
      title="Checkout"
      description="Read the disclaimer and complete your investment"
    >
      <InvestmentCheckoutDisclaimer investment={investment} />
    </FormLayout>
  )
}