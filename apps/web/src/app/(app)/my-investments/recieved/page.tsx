import { InvestmentIndex } from "@/components/app/investments/investment-index";

export default async function MyInvestmentsRecievedPage() {

  return (
    <div >
      <InvestmentIndex type="recieved" />
    </div>
  )
}