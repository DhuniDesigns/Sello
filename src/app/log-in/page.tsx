export const viewport = { themeColor: "#F8F8F8" };

import Link from "next/link";

// Placeholder until this screen is built.
export default function Page() {
  return (
    <main style={{ minHeight: "var(--app-h, 100dvh)", display: "grid", placeContent: "center", gap: 12, padding: 24, textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 26 }}>Log in</h1>
      <p style={{ color: "var(--muted)" }}>This screen is next on the build list.</p>
      <Link href="/" style={{ color: "var(--orange)", fontWeight: 600 }}>Back to welcome</Link>
    </main>
  );
}
