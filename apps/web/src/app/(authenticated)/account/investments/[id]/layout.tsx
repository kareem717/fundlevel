import { getAccountCached } from "@/actions/auth";
import { getInvestmentByIdCached } from "@/actions/investments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Investment",
  description: "Complete Investment",
};

export default async function InvestmentLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    id: string,
  }>,
}>) {
  const { id } = await params;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    console.error("Invalid investment ID", id);
    throw new Error("Invalid investment ID");
  }

  const investment = await getInvestmentByIdCached(parsedId);

  if (!investment?.data?.investment) {
    console.error("Investment not found", id);
    throw new Error("Investment not found");
  }

  const account = await getAccountCached();
  if (!account?.data) {
    console.error("Account not found");
    throw new Error("Account not found");
  }

  if (!investment.data.investment.investorId || investment.data.investment.investorId !== account.data.id) {
    //TOOD: Validate ivnestment owenershipp
    console.error("Investment not found", id);
    throw new Error("Investment not found");
  }

  return (
    <>
      {children}
    </>
  );
}
