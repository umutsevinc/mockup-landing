import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mockup.memselon.com";
  const lastModified = new Date();
  return [
    { url: `${base}/`,        lastModified, changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/waitlist`, lastModified, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/terms`,   lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
