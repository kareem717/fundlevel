export default async function ExploreLayout({
  children,
  createVentureDialog,
  createRoundDialog,
  settingsDialog
}: {
  children: React.ReactNode;
  createVentureDialog: React.ReactNode;
  createRoundDialog: React.ReactNode;
  settingsDialog: React.ReactNode;
}) {

  return (
    <>
      {children}
      {createVentureDialog}
      {createRoundDialog}
      {settingsDialog}
    </>
  );
}
