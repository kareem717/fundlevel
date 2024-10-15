import { Metadata } from "next";
import { ExploreHeader } from "./components/explore-header";
import { getAccount } from "@/actions/auth";

export const metadata: Metadata = {
  title: {
    default: "Explore",
    template: "%s - Explore",
  },
};

export default async function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accountResp = await getAccount();

  const account = accountResp?.data;
  return (
    <div className="grid h-screen w-full overflow-hidden">
      <div className="flex flex-col py-4 justify-start items-start gap-2 sm:gap-4">
        <ExploreHeader account={account} className="px-20 border-b" />
        <div className="px-20">
          {children}
        </div>
      </div>
    </div>
  );
}
