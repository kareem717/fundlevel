import { LinkAccountDialog } from "./components/link-account-dialog";

export default async function RootDashboardPage() {
  return (
    <div className="flex flex-wrap gap-4">
      <LinkAccountDialog />
    </div>
  );
}
