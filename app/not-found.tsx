// Fallback for requests that never reach a locale (for example a missing file under /media).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#0E0E0E", color: "#F3F1EC", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontSize: 96, fontWeight: 900, margin: 0, color: "#BF9643" }}>404</p>
          <h1 style={{ fontSize: 22 }}>Page not found</h1>
          <p>
            {/* A full page load is intended here: this fallback renders outside the locale layout. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ color: "#DFA553" }}>
              Go to Gold R.R Remodeling
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
