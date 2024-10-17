import { ExploreMobileFooter } from "./components/explore-mobile-footer"
import { ExploreIndex } from "./components/explore-index"
import { ExploreHeader } from "./components/explore-header";
import { getAccount } from "@/actions/auth";

export default async function ExplorePage() {
  const accountResp = await getAccount();

  const account = accountResp?.data;
  return (
    <div className="flex flex-col py-4 md:py-8 justify-start items-start gap-2 sm:gap-4 relative h-full">
      <ExploreHeader account={account} className="px-4 md:px-8 lg:px-20 max-w-[3000px] mx-auto fixed top-0 left-0 right-0 z-10" />
      <div className="px-4 md:px-8 lg:px-20 w-full max-w-[3000px] mx-auto h-full">
        <ExploreIndex />
        <ExploreMobileFooter className="sm:hidden fixed bottom-0 left-0 right-0" />
      </div>
    </div>
  );
}