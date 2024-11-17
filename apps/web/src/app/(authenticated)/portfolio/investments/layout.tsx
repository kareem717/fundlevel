import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Portfolio Investments",
    template: "%s | Portfolio Investments",
  },
}

export default async function PortfolioInvestmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
