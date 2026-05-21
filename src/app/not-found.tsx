import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "28rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Page not found
        </h1>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <p style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/">Personal site</Link>
          <Link href="/portfolio">Portfolio</Link>
        </p>
      </div>
    </main>
  );
}


