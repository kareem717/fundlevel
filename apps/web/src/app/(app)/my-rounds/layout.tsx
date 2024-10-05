export default async function MyRoundsLayout({
  children,
  roundDialog
}: {
  children: React.ReactNode;
  roundDialog: React.ReactNode;
}) {

  return (
    <>
      {children}
      {roundDialog}
    </>
  );
}
