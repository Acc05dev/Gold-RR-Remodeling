/** Re-mounts on every navigation, so the gold blade in .page-wipe plays once per route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-wipe" aria-hidden="true" />
      {children}
    </>
  );
}
