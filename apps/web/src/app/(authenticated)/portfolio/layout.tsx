export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col gap-4">
      <h1>Portfolio layout</h1>
      {children}
    </div>
  );
}
