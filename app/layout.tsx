// The real document shell lives in app/[locale]/layout.tsx so <html lang> follows the URL.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
