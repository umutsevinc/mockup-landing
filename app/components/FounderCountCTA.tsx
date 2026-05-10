"use client";

import { useEffect, useState } from "react";

type CountState = { remaining: number; available: boolean };

const FALLBACK: CountState = { remaining: 100, available: true };

export function useFounderCount(): CountState {
  const [state, setState] = useState<CountState>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/founder-lifetime-count")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const remaining = typeof data.remaining === "number" ? data.remaining : FALLBACK.remaining;
        const available = typeof data.available === "boolean" ? data.available : remaining > 0;
        setState({ remaining, available });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export default function FounderCountCTA({
  className = "",
  style = {},
  fallbackHref = "#pricing",
  fallbackLabel = "See pricing",
}: {
  className?: string;
  style?: React.CSSProperties;
  fallbackHref?: string;
  fallbackLabel?: string;
}) {
  const { remaining, available } = useFounderCount();

  if (!available) {
    return (
      <a href={fallbackHref} className={className} style={style}>
        {fallbackLabel}
      </a>
    );
  }

  return (
    <a href="#pricing" className={className} style={style}>
      Claim founder spot ({remaining}/100 remaining)
    </a>
  );
}
