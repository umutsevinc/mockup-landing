import type { MetadataRoute } from "next";
import { COMPARE_ENTRIES } from "@/lib/compare";
import { DEVICE_PAGES } from "@/lib/mockup-pages";
import { GUIDES } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mockiosa.memselon.com";
  const lastModified = new Date();
  return [
    { url: `${base}/`,        lastModified, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/waitlist`, lastModified, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/changelog`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/compare`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...COMPARE_ENTRIES.map((e) => ({
      url: `${base}/compare/${e.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/mockups`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    ...DEVICE_PAGES.map((d) => ({
      url: `${base}/mockups/${d.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/guides`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...GUIDES.map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/featured`, lastModified, changeFrequency: "weekly", priority: 0.4 },
    { url: `${base}/report-bug`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`,   lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
