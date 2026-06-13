type LinkItem = { label: string; href: string };
type Column = { title: string; items: LinkItem[] };

type Props = {
  wordmark: string;
  brandName: string;
  brandIcon?: React.ReactNode;
  tagline: string;
  productLinks: LinkItem[];
  /** Cross-links to the other Memselon tools (SEO bridge) */
  memselonLinks: LinkItem[];
  legalLinks: LinkItem[];
};

/**
 * Marc Lou × Contralabs-style multi-column footer.
 * Big wordmark (Inter Bold ~140-160 fluid), 4-col link grid,
 * cross-link "MEMSELON" column for the SaaS portfolio SEO bridge.
 */
export function MarcLouFooter({
  wordmark,
  brandName,
  brandIcon,
  tagline,
  productLinks,
  memselonLinks,
  legalLinks,
}: Props) {
  const columns: Column[] = [
    { title: "PRODUCT",  items: productLinks },
    { title: "MEMSELON", items: memselonLinks },
    { title: "LEGAL",    items: legalLinks },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-[#0a0a0a] text-[#fafaf7]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "SF Pro Display", sans-serif' }}
    >
      {/* Left-edge dotted filigrane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-20 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(250,250,247,0.35) 1px, transparent 1px)",
          backgroundSize: "14px 18px",
        }}
      />

      {/* Big wordmark — inline styles win over inherited h2 rules in any project */}
      <div className="px-6 pt-12 md:pt-20">
        <h2
          className="text-center"
          style={{
            fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "SF Pro Display", sans-serif',
            fontSize: "clamp(3rem, 11vw, 9rem)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.055em",
            color: "#fafaf7",
            margin: 0,
          }}
        >
          {wordmark}
        </h2>
      </div>

      {/* 4-col grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 pb-12 pt-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-14 md:pb-16 md:pt-20">
        {/* Brand col */}
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#FF4B1F] text-base font-bold"
            >
              {brandIcon ?? "◇"}
            </span>
            <span className="text-base font-bold">{brandName}</span>
          </div>
          <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-white/60">
            {tagline}
          </p>
        </div>

        {/* Link cols */}
        {columns.map((c) => (
          <div key={c.title}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/42">
              {c.title}
            </h3>
            <ul className="mt-3 space-y-3">
              {c.items.map((it) => (
                <li key={it.label}>
                  <a
                    href={it.href}
                    className="text-sm font-medium text-white/88 transition-colors hover:text-[#FF4B1F]"
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="mx-auto max-w-6xl border-t border-white/10 px-6 py-7">
        <div
          className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center"
          style={{
            fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(250,250,247,0.55)",
          }}
        >
          <span>© 2026 {brandName} · part of the Memselon ☁ portfolio</span>
          <div className="flex gap-6">
            <a href="https://x.com/memselon" target="_blank" rel="noreferrer" className="hover:text-[#FF4B1F]" style={{ color: "inherit" }}>
              @memselon on X
            </a>
            <a href="mailto:hi@memselon.com" className="hover:text-[#FF4B1F]" style={{ color: "inherit" }}>
              hi@memselon.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
