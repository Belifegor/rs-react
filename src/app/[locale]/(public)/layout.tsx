export default function PublicLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-grow">{children}</div>
      <div>{modal}</div>
    </div>
  );
}
