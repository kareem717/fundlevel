export default async function BankAccountPage({
  params,
}: { params: Promise<{ companyId: string; accountId: string }> }) {
  const { companyId, accountId } = await params;
  const parsedId = Number.parseInt(accountId, 10);

  return (
    <div>
      <h1>
        Bank Account {accountId} for company {companyId}
      </h1>
    </div>
  );
}
