export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col gap-4">
      <h1>Account layout</h1>
      {children}
    </div>
  );
}
