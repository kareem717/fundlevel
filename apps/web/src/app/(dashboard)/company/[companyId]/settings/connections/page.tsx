import { ConnectionTabs } from "./components/connection-tabs";

export default async function ConnectionsSettingsPage({
  params,
}: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const parsedId = Number.parseInt(companyId, 10);

  return (
    <div className="py-4">
      <ConnectionTabs companyId={parsedId} />
    </div>
  );
}
